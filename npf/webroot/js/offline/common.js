//For Document Ready 
$(document).ready(function(){
   jQuery(window).load(function(){
    jQuery(".initHide").addClass('initShow');
   });
   
    if($('.sumo_select').length){
        $('.sumo_select').SumoSelect({placeholder: 'Select Value', search: true, searchText:'Search Value', selectAll : true, csvDispCount:0, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false ,showTitle : false}); 
        $('.sumo_select')[0].sumo.reload();
    }
	
	if($('.checkboxSumoJS').length){
        $('.checkboxSumoJS').SumoSelect({placeholder:'Select Value', search: true, searchText:'Search Value', selectAll :true, okCancelInMulti :true, csvDispCount:0, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false ,showTitle : false}); 
        $('.checkboxSumoJS')[0].sumo.reload();
    }
    
   //For Load Forms in Manage List Module for college admin/Staff
   if(typeof manageCollegeID !='undefined' && manageCollegeID >0){
       OfflineLoadForms(manageCollegeID, '','div_load_forms','','',"automationListFormId");
       getOwnerListByCollegeId(manageCollegeID);//listowner 
       
       //If there is no any filter from URL and length is less than 0 then load Listing
        if(typeof jsVars.filterOption !== 'undefined' && jsVars.filterOption.length<=0) {
           LoadMoreOfflineLeads('reset');
        }
   }
   
   //For  Manage Segment Module for college admin/Staff
   if(typeof segmentCollegeID !='undefined' && segmentCollegeID >0){
       getSegmentOwnerListByCollegeId(segmentCollegeID);//segment owner
   }
   
   //For Load View Reports
   if(typeof viewReportCollegeID !='undefined' && viewReportCollegeID >0){       
        if(typeof viewListID !='undefined' && viewListID >0){
            getAllListnameByCollegeId(viewReportCollegeID,'list_id',viewListID,'view_reports'); 
        }
   }
   
   //For Manage Contact Page (if college id and list id found from url)
   if(typeof manageContactCollegeID !='undefined' && manageContactCollegeID >0){       
        if(typeof manageContactListID !='undefined' && manageContactListID >0){
            getAllListnameByCollegeId(manageContactCollegeID,'list_id',manageContactListID,'manage_contact');             
        }
   }
   
    //For Segment Manage Contact Page (if college id and list id found from url)
    if(typeof segmentManageContactCollegeID !='undefined' && segmentManageContactCollegeID >0){
        if(typeof segmentManageContactSegmentID !='undefined' && segmentManageContactSegmentID >0){
            LoadMoreSegmentContacts('reset');
        }
    }
   
   
   //Incase of Edit Segment Call below 2 function so it will display total records
   if(typeof EditSegmentID !='undefined' && EditSegmentID >0){
        if(typeof EditSegmentID !='undefined' && EditSegmentID >0){
            countRecordsByListIdMongo();
            countSegmentViewFromMongo();
        }
   }
   
   // to check if fields are changed or not
   $(document).on( "change","#advanceFilter select, #advanceFilter input, #search_common, #search",function(){
           is_filter_button_pressed = 0;
   });
   
   //When Advanced Filter button is clicked in Manage Contact Page then display advanced filter
   $('#manage_contact_adv_search').click(function(){
       $('#advanced_filter').toggle();
   });
   
   $('input[name=\'search_criteria\']').click(function(){
       $('#filter_criteria').show();
   });
   
   //Close Filter column box
   jQuery(function(){
        $('.filter_collapse').dropdown('toggle');
    });

   //Whcn click on Add Another Criteria in manage Contact Page
   $(document).on('click', '.manage_contact_another_criteria', function () {
        var div = $("div.more_criteria:first");
        var cloned = div.clone();
        
        $(cloned).find('.chosen-container').remove(); //  remove chosen dropdown hidden div
        
        var total_div=$(".more_criteria").length;
        
        //remove text value on add more for remove previouse value
        //$(jsHtml).find(":text").val('');
        $(".more_criteria:last").after(cloned);
        var new_div='adv_filter_row_'+(total_div+1)+parseInt(new Date().getUTCMilliseconds());
        $(".more_criteria:last").attr('id',new_div);
        
        //Unset second dropdown Value
        var $el=$('#'+new_div).find('div.second_column > select');
        $el.empty();
        $el.append($("<option>Condition</option>").attr("value", ""));
        
        //In third column always add input Box
        //$('#'+new_div).find('div.third_column').html('');
        $('#'+new_div).find('div.third_column').html('<input class="form-control " name="advanced_filter[condition_value][]" value="" placeholder="" type="text" disabled="disabled" >');
        
        //Blank Textbox Value
        //$('#'+new_div).find('div.third_column >div input[type="text"]').val('');
        
        //alert(jsVars.integerDataTypeLabel);
        $(cloned).hide(); // this is for effect.
        $(cloned).fadeIn('slow'); // this is for effect.
    
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        $(".more_criteria:last").trigger('chosen:updated');
    });
    
    
   //Load DatePicker
   LoadReportDateRangepicker();
   
   
   //For offline/upload-checklist Page
   $( ".checklist_checkbox" ).click(function() {
        var total_checkbox_checked=checklistCheckboxValidation();
        if(total_checkbox_checked == 4) {
            $('#checklist_next_btn').removeAttr('disabled');
        } else {
            $('#checklist_next_btn').attr('disabled','disabled');
        }
    });
   
    
    //This is for offline/upload-csv-mapping page when custom_label is selected from the dropdown value
    $(".label_options").change(function () {
        if($(this).val()=='custom_label') {
            $(this).val('');
            $('.chosen-select').chosen();
            $('.chosen-select').trigger('chosen:updated');
            createCustomLabel('custom_label','',$(this).attr('id'),$('#u_college_id').val());
        }
    });
    
    $('.a-custom_label').on('click',function(){
        createCustomLabel('custom_label','',$(this).attr('data-id'),$('#u_college_id').val());
    });
   /**
    * This is for Export data using batch as per dynamic condition
    */
   if (typeof pageType !='undefined') {
       var formIdName='';
       var download_url='';
       
       switch(pageType) {
           case 'list_manager':
               var filterOption = jsVars.filterOption;//only all filter key
               if(filterOption.length > 0){
                   filterSelectFromUrl();
               }
               formIdName='listManager';
               download_url='/offline/ajax-list-manager';
               break;
           case 'manage_list_contact':
                if(typeof jsVars.filterOption !='undefined') {
                    var filterOption = jsVars.filterOption;//only all filter key
                    if(filterOption.length > 0){
                        filterSelectFromUrl();
                    }
                }
               formIdName='manageContacts';
               download_url='/offline/ajax-manage-contacts';
               break;
            case 'manage_segment':
                formIdName='segmentManager';
                download_url='/offline/ajax-segment-list';
                break;
            case 'manage_segment_contact':
                formIdName='manageContacts';
                download_url='/offline/ajax-manage-segment-contacts';
                break;
       }
       
        if(formIdName!= '' && download_url!='') {
            hitPopupBatchBind(formIdName,download_url);
        }
   }
   
   $('.filterCollasp').on('click', function(e) {
        e.preventDefault();
        $('.filterCollasp').parent().removeClass('active');
        $(this).parent().addClass('active');
    });
    
   $('.columnCheckAll').on('click', function(e){
        $(this).toggleClass('checked');
        if($(this).hasClass('checked')) {
            $('#column_li_list input:checkbox:not(:disabled)').prop('checked', true);
        } else {
            $('#column_li_list input:checkbox:not(:disabled)').prop('checked', false);
        }
    });
    
   // segment criteria inner container copy as child
   $(document).on('click', '.make-inner-copy', function (e) {
        e.preventDefault();
        var outerGroupContainer =  $(this).parents('.outer-group-container');
        var dataGroupId = parseInt(outerGroupContainer.attr('data-group'));
        var segment_criteria = outerGroupContainer.find('input[name="segment['+dataGroupId+'][criteria]"]:checked').val();
        if(typeof segment_criteria != 'undefined') {
            var container = outerGroupContainer.find(".inner-criteria-container:first").html();
            var nextAttrId = parseInt(outerGroupContainer.find(".inner-criteria-container").last().attr('data-attr'))+1;
			
            var removeText = '<a class="text-danger pull-right" href="javascript:segmentRemoveRow('+dataGroupId+', '+nextAttrId+');"><i class="fa fa-minus-circle fa-2x" aria-hidden="true"></i></a>';
            var conditionAndClass = '';
            var conditionOrClass = '';
            if(segment_criteria == 'or') {
                conditionOrClass = 'active';
            } else if(segment_criteria == 'and'){
                conditionAndClass = 'active';
            }
            //var button = '<div class="condition-text toggle-btn"><span class="btn btn_or condition-text-and '+conditionAndClass+'">And</span><span class="btn btn_or condition-text-or '+conditionOrClass+'">Or</span></div>';
            outerGroupContainer.find(".inner-criteria-container:last").after('<div class="row inner-criteria-container margin-top-10" data-group='+dataGroupId+' data-attr='+nextAttrId+'>'+container+'</div>');
            outerGroupContainer.find(".inner-criteria-container:last").find('.segementRowAction').append(removeText);
            // change fields name
            outerGroupContainer.find(".inner-criteria-container:last .segment-lable").attr('name','segment['+dataGroupId+']['+nextAttrId+'][label]').val('');
            outerGroupContainer.find(".inner-criteria-container:last >div > span.segment-list-error").remove();
            outerGroupContainer.find(".inner-criteria-container:last .segment-condition").attr('name','segment['+dataGroupId+']['+nextAttrId+'][condition]').html('<option value="">Condition</option>');
            outerGroupContainer.find(".inner-criteria-container:last .segment-value-container").html('<div class="input text"><div class="form-group"><input name="segment['+dataGroupId+']['+nextAttrId+'][value]" class="segment-value form-control" placeholder="Enter Value" style="display:block" value="" type="text"><span class="material-input"></span></div></div>');
            outerGroupContainer.find(".inner-criteria-container:last .chosen-container").remove();
            outerGroupContainer.find('.inner-criteria-container:last .chosen-select').chosen();
            outerGroupContainer.find(".make-group-copy").show();
            outerGroupContainer.find(".make-outer-copy").show();
            outerGroupContainer.find(".segment-group-container").hide();
            if($('.outer-group-container').length >= 4){
                outerGroupContainer.find(".make-group-copy").hide();
                outerGroupContainer.find(".make-outer-copy").hide();
                outerGroupContainer.find(".segment-group-container").hide();
            } else {
                outerGroupContainer.find(".make-group-copy").show();
                outerGroupContainer.find(".make-outer-copy").show();
                outerGroupContainer.find(".segment-group-container").hide();
            }
            outerGroupContainer.find(".inner-criteria-container:last option:selected").removeAttr("selected");
            outerGroupContainer.find('.inner-criteria-container:last .chosen-select').chosen();
            outerGroupContainer.find('.inner-criteria-container:last .chosen-select').trigger('chosen:updated');
        } else {
            alertPopup('Please select criteria.', 'error');
        }
   });
   
   $(document).on('click', '.segment-group-container label', function (e) {
        e.preventDefault();
        var segment_criteria_group = $(this).find('input').val();
        $('.segment-group-container label').removeClass('active');
        $('input[name="segment-group-more"]').prop('checked', false);
        if(segment_criteria_group == 'or') {
            $('input[name="segment-group-more"][value="or"]').prop('checked', true);
            $('input[name="segment-group-more"][value="or"]').parent().addClass('active');
        } else {
            $('input[name="segment-group-more"][value="and"]').prop('checked', true);
            $('input[name="segment-group-more"][value="and"]').parent().addClass('active');
        }
   });
   
    // parent each group more click
      $(document).on('click', '.make-outer-copy', function (e) {
        e.preventDefault();
        var dataGroupId = parseInt($(this).attr('data-group-val'));
        if($('.make-group-copy').length){
            var cloneGroupCondition = $('.make-group-copy').html();
        } else {
            var cloneGroupCondition = '<div data-toggle="buttons" class="segment-group-container toggle-btn"><label class="btn btn_or active"><input type="radio" class="segment-group-more" name="segment-group-more" autocomplete="off" value="or" checked="checked"> Or</label><label class="btn btn_and"><input type="radio" class="segment-group-more" name="segment-group-more" autocomplete="off" value="and"> And</label></div>';   
        }
        var firstSelected = $('.outer-group-container:first .segment-criteria-condition input:checked').val();

        var container = $(".outer-group-container:first").html();
        
        $(".outer-group-container:last").after('<div class="input-group make-group-copy text-center" style="width:100%" data-group-copy="'+dataGroupId+'">'+cloneGroupCondition+'</div><div class="outer-group-container" data-group='+dataGroupId+' style="display:none;">'+container+'</div>');
        
        var closeHtml = '<div class="removeElementClassBlock text-right"><a onclick="return confirmDelete('+dataGroupId+');" href="javascript:void(0)" class="text-danger"><span aria-hidden="true" class="glyphicon glyphicon-remove"></span></a></div>';
        $(".outer-group-container:last .group-container").append(closeHtml);
        $('.outer-group-container:last .inner-criteria-container:not(:first)').remove();
        $('.outer-group-container:last .inner-criteria-container').attr('data-group',dataGroupId);
        
        $(".outer-group-container:last .inner-criteria-container:last option:selected").removeAttr("selected");

        // change fields name
        var nextAttrId = 0;
        $(".outer-group-container:last .segment-criteria").attr('name','segment['+dataGroupId+'][criteria]').prop('checked', false);
        $(".outer-group-container:last .segment-criteria").parent().removeClass('active');
        $(".outer-group-container:last .inner-criteria-container:last").find('.segment-lable').attr('name','segment['+dataGroupId+']['+nextAttrId+'][label]').val('');
        $(".outer-group-container:last .inner-criteria-container:last").find('.segment-condition').attr('name','segment['+dataGroupId+']['+nextAttrId+'][condition]').html('<option value="">Condition</option>');;
//        $(".outer-group-container:last .inner-criteria-container:last").find('.segment-value').attr('name','segment['+dataGroupId+']['+nextAttrId+'][value]').attr('value','');
        $(".outer-group-container:last .inner-criteria-container:last").find('.segment-value-container').html('<div class="input text"><div class="form-group"><input name="segment['+dataGroupId+']['+nextAttrId+'][value]" class="segment-value form-control" placeholder="Enter Value" style="display:block" value="" type="text"><span class="material-input"></span></div></div>');
        $(".outer-group-container:last .inner-criteria-container:last .chosen-container").remove();
        $(".outer-group-container:last .inner-criteria-container:last .chosen-select").chosen();
        $(".outer-group-container:last .make-group-copy label").removeClass('active');
        $(".outer-group-container:last .make-group-copy").hide();
        $(".outer-group-container:last").show();
        $('.make-outer-copy').attr('data-group-val', dataGroupId+1);
        
        if(firstSelected == 'and') {
            $('.outer-group-container:first .segment-criteria-condition input[value="and"]').parent().trigger('click');
        } else {
            $('.outer-group-container:first .segment-criteria-condition input[value="or"]').parent().trigger('click');
        }
        // to hide add more container button
        if($('.outer-group-container').length >= 4){
            $(".make-outer-copy").hide();
        } 
    });
    
    // inner criteria condition click
    $(document).on('click', '.group-container .segment-criteria-condition label', function (e) {
        var selectedInnerGroup = $(this).find('.segment-criteria').val();
        $(this).parents('.group-container').find('.condition-text span').removeClass('active');
        if(selectedInnerGroup == 'and') {
            $(this).parents('.group-container').find('.condition-text .condition-text-and').addClass('active');
        } else if(selectedInnerGroup == 'or'){
            $(this).parents('.group-container').find('.condition-text .condition-text-or').addClass('active');
        }
    });
    // segment criteria make condition lable
    $(document).on('change', '.segment-lable', function () {
        value_field = $(this).val();
        var arr = value_field.split("||");
        type = "";
        
        if (arr.length >= 1) {
            var type = arr[0];
            var val_json = arr[1];
            var $dl=$(this).parents('.inner-criteria-container').find('.segment-value-container');
            if(typeof $(this).parents('.inner-criteria-container').find('.segment-value-container input').attr('name') != 'undefined'){
                var segmentValueName = $(this).parents('.inner-criteria-container').find('.segment-value-container input').attr('name');
                var segmentClassName = $(this).parents('.inner-criteria-container').find('.segment-value-container input').attr('class');
                var segmentPlaceholder = $(this).parents('.inner-criteria-container').find('.segment-value-container input').attr('placeholder');
            } else {
                var segmentValueName = $(this).parents('.inner-criteria-container').find('.segment-value-container select').attr('name');
                var segmentClassName = 'segment-value form-control';
                var segmentPlaceholder = 'Enter value';
            }
            var dataTypeList='';
            
            if(type=='integer') {
                dataTypeList=jsVars.integerDataTypeLabel;
                $dl.html(getDependentConditionField(segmentValueName, segmentClassName, segmentPlaceholder));
            }else if(type=='selectbox') {
                dataTypeList=jsVars.selectboxDataTypeLabel;
                $dl.html(getDependentConditionField(segmentValueName, segmentClassName, segmentPlaceholder));
                if(val_json == 'created_by'){
                    $(this).parents('.inner-criteria-container').find('.segment-value-container').html('<select name="'+segmentValueName+'" class="chosen-select">'+$('.uploadedBy').html()+'</select>');
                }else if(val_json == 'bounce_email'){
                    $(this).parents('.inner-criteria-container').find('.segment-value-container').html('<select name="'+segmentValueName+'" class="chosen-select">'+$('.bounceEmailStatus').html()+'</select>');
                }else if(val_json == 'bounce_sms'){
                    $(this).parents('.inner-criteria-container').find('.segment-value-container').html('<select name="'+segmentValueName+'" class="chosen-select">'+$('.bounceSMSStatus').html()+'</select>');
                }else if(val_json == 'mobile_registration_status' ){
                    $(this).parents('.inner-criteria-container').find('.segment-value-container').html('<select name="'+segmentValueName+'" class="chosen-select">'+$('.mobileStatus').html()+'</select>');
                }else if(val_json == 'registration_status' ){
                    $(this).parents('.inner-criteria-container').find('.segment-value-container').html('<select name="'+segmentValueName+'" class="chosen-select">'+$('.leadStatus').html()+'</select>');
//                }else if(val_json == 'stage'){
//                    $(this).parents('.inner-criteria-container').find('.segment-value-container').html('<select name="'+segmentValueName+'" class="chosen-select">'+$('.leadStage').html()+'</select>');
                }
            } else if(type=='date') {
                dataTypeList=jsVars.dateDataTypeLabel;
                $dl.html(getDependentConditionField(segmentValueName, segmentClassName, segmentPlaceholder));
                $dl.find('input').addClass('daterangepicker_report'); 
                LoadReportDatepicker();
                LoadReportDateRangepicker();
            } else if(type=='varchar') {
                dataTypeList=jsVars.varcharDataTypeLabel;
                $dl.html(getDependentConditionField(segmentValueName, segmentClassName, segmentPlaceholder));
            }

            var $el=$(this).parents('.inner-criteria-container').find('.segment-condition');
            $el.empty();
            $el.append($("<option>Condition</option>").attr("value", ""));

            $.each(dataTypeList, function(key, value) {
                $el.append($("<option></option>")
                               .attr("value",key)
                               .text(value));
           });               

            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $el.trigger('chosen:updated');
            
        }
    });
    $(document).on('click', '.condition-text span', function (e) {
        if($(this).hasClass('condition-text-and')) {
           var selected = 'and';
        } else {
           var selected = 'or';
        }
//        var dataGroupId = parseInt($(this).parents('.outer-group-container').attr('data-group'));
        $(this).parents('.outer-group-container').find('.segment-criteria-condition label').removeClass('active');
        $(this).parents('.outer-group-container').find(".segment-criteria").prop('checked', false);
        if(selected == 'or') {
            $(this).parents('.group-container').find('.segment-criteria-condition input[value="or"]').prop('checked', true);
            $(this).parents('.group-container').find('.segment-criteria-condition input[value="or"]').parent().addClass('active');
        } else {
            $(this).parents('.group-container').find('.segment-criteria-condition input[value="and"]').prop('checked', true);
            $(this).parents('.group-container').find('.segment-criteria-condition input[value="and"]').parent().addClass('active');
        }
        
        $(this).parents('.group-container').each(function(){
            $(this).find('.condition-text span').removeClass('active');
            if(selected == 'or') {
                $(this).find('.condition-text span.condition-text-or').addClass('active');
            } else {
                $(this).find('.condition-text span.condition-text-and').addClass('active');
            }
        });
    });
    //assign multiselect by id
    if ( $.isFunction($.fn.SumoSelect) ) {
        $('#segment-list').SumoSelect({okCancelInMulti:false, search: true, searchText:'Search List Name', selectAll : true, csvDispCount:0, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    }
    
    $(document).on('change', '#segment-list', function (e) {
        $('.segment-list-error').remove();
    });
    
    $('#segment_name').on('keypress', function(){
        $('.segment-name-error').remove();
    });
    // skip redirect when click on create segment
    $('.mange-segment-create').bind('click',function(e){
        var url = $(this).attr('href').split("/");
        if(url.length <= 3){
            e.preventDefault();
        }
    });
});

sumoSelectOpen();

/**
 * Load all forms as per college id
 * @param {type} college_id
 * @param {type} selected_form_id
 * @param {type} div_id
 * @param {type} multiselect
 * @returns {undefined}
 */
function OfflineLoadForms(college_id, selected_form_id,div_id,multiselect,hidedatafrm,automationListFormId) {
    if(hidedatafrm == 'hidedata'){
         hidedata();//REST FORM 
    }
//    alert(college_id+selected_form_id+div_id+multiselect+hidedatafrm);
     if(college_id.length <= 0) {
            return false;
        }
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        data: {
            "college_id": college_id,
            "default_val": selected_form_id,
            "multiselect":multiselect
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:true,
		beforeSend: function () {
            $('#listloader').show();
        },
        complete: function () {
            $('#listloader').hide();
        },
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#'+div_id).html(data);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('.chosen-select').trigger('chosen:updated');
            if(typeof automationListFormId!='undefined' && $('#'+automationListFormId).length > 0){
                $('#'+automationListFormId).html(data);
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * This function is user for Add/Edit List
 * @param {string} json_encode data
 * @returns null
 */
function AddEditCreateList() {
    //Display Error
    $('.show_err').html('');
    $.ajax({
       url: jsVars.createListURL,
       type: 'post',
       dataType: 'json',
       data: $('#addListForm').serializeArray(),
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (json) {
            //system error
            if((typeof json['session_error'] !='undefined' && json['session_error']=='session_logout') || 
               (typeof json['token_error'] !='undefined' && json['token_error']=='token_error')){
                window.location.reload(true);
            }
            //error
            if(json['error']){
                for (var i in json['error']) {
                    $('#'+i+'_error').html(json['error'][i]).addClass('error');
                }
            }
            //success
            if(json['status'] === 200) {
                location = json['location'];
            } 
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

/**
 * 
 * @param {type} type
 * @returns {Boolean}
 */
function LoadMoreOfflineLeads(type) {
    if($('#s_college_id').val()<=0) {
        $('#load_more_results > tr > td > div > div').html("<div class='alert alert-danger'>Please select an Institute Name and click Search to view lists.</div>");
        $('#load_more_button').hide();
        $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More list');
         if (type != '') {
                $('#if_record_exists').hide();
         }  
         return false;
    }
  
    if (type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_results_msg').show("");
        $('#load_more_button').show();
        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
        $('button[name="search_btn"]').attr('disabled','disabled');
        
        var d = new Date();
        var hours = d.getHours();
        var ampm = hours >= 12 ? ' PM' : ' AM';
        var day=(d.getDate()<10)?'0'+d.getDate():d.getDate();
        
        var current_month=d.getMonth()+1; //Because start from 0
        var month=(current_month<10)?'0'+current_month:current_month;
        
        var hours=(d.getHours()<10)?'0'+d.getHours():d.getHours();
        var minute=(d.getMinutes()<10)?'0'+d.getMinutes():d.getMinutes();
       // $('#lastRefreshTime').html(day+'/'+month+'/'+d.getFullYear()+' '+hours+':'+minute + ampm);
        
    }
    var data = $('#listManager').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');
    $.ajax({
        url: '/offline/ajax-list-manager',
        type: 'post',
        dataType: 'html',
        data: data,
        beforeSend: function (xhr) {
            $('#listloader').show();
			$('.daterangepicker_report').prop('disabled', true);
			$('#main-header').siblings('.dropdown-menu-tc').remove();/*** For Dropdown remove once click on refresh button ***/
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            Page = Page + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            }
            else if (data == "error") {
                if(Page==1){
					$('#table-data-view').hide();
					$('#load_msg_div').show();
					$('#load_msg').html('No Records found');
				}else{
					$('#load_more_results tbody').append("<tr><td colspan='10' class='text-center text-danger fw-500'>No More Record</td><tr>");
				};
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;Load More Lists");
                $('#load_more_button').hide();
                if (type != '' && Page==1){
                    $('#if_record_exists').hide();
                }
            }else if(data == 'permision_denied'){
                    window.location.href= '/permissions/error';
                }else {
                
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
				$('#table-data-view').show();
				$('#load_msg_div').hide();
                data = data.replace("<head/>", '');
				if (Page==1) {
				  $('#load_more_results').append(data);
                } else {
					$('#load_more_results tbody').append(data);
				}
				// if select all then all checkbox is selected
				var selectAllID = document.getElementById('select_all');
				selectAllCheckbox(selectAllID);
                
                $('#load_more_button').removeAttr("disabled");
                
                if(typeof jsVars.itemPerPage !='undefined' &&
                   $('#all_records_val').val() >= jsVars.itemPerPage
                  ){
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Lists");
                  } else {
                      $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Lists");
                      $('#load_more_button').hide();
                  }                
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
                //$.material.init();
				$('#createAutomationListPopupArea .close').removeClass('npf-close');
				$('#actionList').show();
            }
			if($('#s_college_id').val()=='' || $('#s_college_id').val()==null){
					$('.expandableSearch').hide();
			   }else{
				   $('.expandableSearch').show();
			}
			dropdownMenuPlacement();
			//determineDropDirection();
                         if (data != "error") {
                            table_fix_rowcol();
                        }
			$('.offCanvasModal').modal('hide');
		},
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
			$('button[name="search-btn"]').removeAttr('disabled');
			$('.daterangepicker_report').prop('disabled', false);
        }
    });

    return false;
}

/**
 * This function will select all checkbox if checked else unchecked
 * @param {type} elem
 * @returns {undefined}
 */
function selectAllCheckbox(elem){    
    if(elem.checked){
            $('.select_id').each(function(){
                //alert($(this).attr('disabled'));
                if($(this).attr('disabled')!="disabled"){;
                    this.checked = true;
                }
            });
    }else{
        $('.select_id').attr('checked',false);
    }
    
    // if bulk select is selected then empty the value of single user.
    // it is used in mktg leads and  mktg segments
    if($('#single_user_id').length>0){
        $('#single_user_id').val("");
    }
}


/**
 * This function will return true if total checked value is greater than max_checkbox_checked
 * @param (string) elem (Pass class name)
 * @param (int) max_checkbox_checked (Pass maximum checkbox checked
 * @returns {Boolean}
 */
function isMultipleCheckboxChecked(elem,max_checkbox_checked){
    if($("." + elem).length > 0) {
       if($('.'+elem+':checked').length >= max_checkbox_checked) {
           return true;
       } else {
           return false;
       }
    }
}

/**
 * This function will return all checked box value
 * @param (String) checkbox_name (Name of the checkbox )
 * @returns array
 */
function getAllCheckedValue(checkbox_name){
    return $('input[name=\''+checkbox_name+'\']:checked').map(function()
        {
            return $(this).val();
        }).get();
}

/*For Batch Download */
function hitPopupBatchBind(formIdName,url){
    
       $('.modalButton').on('click', function(e) {        
        var $form = $("#"+formIdName);
        $form.attr("action",url);
        $form.attr("target",'modalIframe');
        $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        $form.submit();
        $form.attr("onsubmit",onsubmit_attr);
        $form.removeAttr("target");
        $form.find('input[name="export"]').remove();
        //Remove Export hidden value to blank so searching will work again
        $('#export').val('');
    });
    $('#myModal').on('hidden.bs.modal', function(){
        $("#modalIframe").html("");
        $("#modalIframe").attr("src", "");
    });
}

/*For Delete List Action*/
function deleteAction(elem,max_checkbox_checked,type,id){
    //Check how many records are there as per filter so if only 1 record found then bulk action should work
    var total_result=0;
    if($('#all_records_val').length>0) {
        total_result = $('#all_records_val').val();
    }
    
    if(type!='single' && isMultipleCheckboxChecked(elem,max_checkbox_checked)==false) {
        alertPopup('Select more than one list', 'error');
    } else {  
        
        if(type=='single') { //If type is single then pass the list_id
            var all_ids=id;
        } else {
            var all_ids=getAllCheckedValue('selected_users[]');
            var select_all=getAllCheckedValue('select_all');
        }
        
        $("#confirmYes").removeAttr('onclick');
        $('#confirmTitle').html("Confirm Delete action");
        $("#confirmYes").html('Ok');
        $("#confirmYes").siblings('button').html('Cancel');

        $('#ConfirmMsgBody').html('Are you sure you want to delete selected list?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: '/offline/delete-list-name',
                    type: 'post',
                    data: {'id_list': all_ids,'college_id': $('#s_college_id').val(), 'action': 'delete','select_all':select_all},
                    dataType: 'json',
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('div.loader-block').show();
                    },
                    complete: function () {
                        $('div.loader-block').hide();
                    },
                    success: function (json) {
                        if (typeof json['redirect'] !='undefined' && json['redirect'] !='') {
                            alertPopup(json['error'], 'error','/offline/list-manager');
                        } else if (typeof json['error'] !='undefined' && json['error'] !='') {
                            alertPopup(json['error'], 'error');
                        } else if (typeof json['status'] !='undefined' && json['status'] == 200) {                            
                            alertPopup( json['message'], "success");
                            LoadMoreOfflineLeads('reset');
                        }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
                    }
                });
                $('#ConfirmPopupArea').modal('hide');
            });
        return false;
    }
}

/**
 * This function will count whether all checkbox is checked except skip_checkbox array variable value
 * @returns Total checkbox checked
 */
function checklistCheckboxValidation(){
    var skip_checkbox_checked=new Array();
    var all_checkbox= $( "form#uploadChecklist input:checkbox" ); //Get All Checkbox
    var total_checkbox_checked=0;
    if(all_checkbox.length>0) {        

        var skip_checkbox=['tag']; //These name will skip so store in an array

        $('form#uploadChecklist input:checked').each(function() {                

            //If current name is not exist in skip_checkbox array variable then return -1
            if(jQuery.inArray($(this).attr('name'), skip_checkbox) == -1) {
                total_checkbox_checked++;
            }
        });
    }
    return total_checkbox_checked;
}

/**
 * THis function is for Create Custom Label which will open the modal box and save data using Ajax
 * @param (string) val
 * @returns {undefined}
 */
function createCustomLabel(val,type,select_box_id,clg_id){     
    $('#select_box_id').val(select_box_id);
    $('#s_college_id').val(clg_id);
    
    $("#add_edit_custom_label").hide();//hide message
    var postData='';
    var loadPopup=0;
    if(typeof type !='undefined' && (type=='add')){ //This will
        $('.show_err').html('');
        $('#other_id_error').removeClass('error alert alert-danger');
        var postData = $('#customLabelForm').serialize();
    } else { //When display the popup
        
        jQuery('#showCreateCustomListContainer').html('loading...');
        //postData={data:data};
        var postData = $('#listManager').serialize();  
        loadPopup=1;        
        $("#add_edit_list").removeClass("alert alert-success");
        $("#add_edit_list").html("");
        $('#label_name').val('');
    }
    $.ajax({
       url: '/offline/create-custom-label',
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
           }
           
           if(loadPopup==1) {
               if(json['data'] != '') {
                    
                    var $el = $('#data_type');
                    $el.empty();
                    $el.append($("<option>Data Type</option>").attr("value", ""));
                    
                    $.each(json['data']['data_type'], function(key, value) {   
                        $('#data_type')
                            .append($("<option></option>")
                                       .attr("value",key)
                                       .text(value));
                   });
                   $el.trigger("chosen:updated");
                }
                $('#showCreateCustomLabelPopUp').trigger('click');
           }
           
           
           //Display Error
           $('.show_err').html('');
           if(typeof json['error'] !='undefined'){
                for (var i in json['error']) {                    
                    $('#'+i+'_error').html(json['error'][i]).addClass('error');
                }
            }

             if(typeof json['data_update'] !='undefined' && json['data_update']=='update'){
                $("#add_edit_custom_label").show();                
                $("#add_edit_custom_label").addClass("alert alert-success").html('Custom label created successfully.');
                
                //Add Newly Added option to every select option
                if(typeof json['data'] !='undefined' && json['data']!=''){
                    $("select.label_options option[value='custom_label']").before($("<option></option>")
                       .attr("value",json['data'])
                       .text($('#label_name').val()));   
                    $("select.label_options").trigger("chosen:updated");
                }
                
                //Call this function so it will load the Taxonomy on that dropdown
                //getAllOfflineTaxonomy(select_box_id);
             }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

/**
 * This function will load all category list as per machine_key
 * @param (string) machine_key
 * @returns {undefined}
 */
function getAllOfflineTaxonomy(machine_key) {
    $.ajax({
        url: '/offline/get-all-offline-taxonomy',
        type: 'post',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:false,
        success: function (json) {
            if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }
            
            if(typeof json['error'] !='undefined' && json['error']!=''){
               alertPopup(json['error'], 'error');
            }
           
            if(json['data'] != '') {                    
                var $el = $('#'+machine_key);
                $el.empty();
                $el.append($("<option>Select Label</option>").attr("value", ""));

                $.each(json['data']['label_option'], function(key, value) {   
                    $el.append($("<option></option>")
                                   .attr("value",key)
                                   .text(value));
               });
               $el.trigger("chosen:updated");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * This function use for change list owner
 * 
 * @returns {undefined}
 */
function changeListOwnerAction(list_id){
    $('#current_owner_id').SumoSelect({okCancelInMulti:false, csvSepChar : ',', search: true, searchText:'Search Owner Name', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    $('#change_owner_list').html('').SumoSelect({okCancelInMulti:false, search: true, placeholder:'Select Owner Name', searchText:'Search Owner Name', selectAll : true, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });
    $('#change_owner_id_error').removeClass('error alert alert-danger');
    $("#change_owner_succ_list").hide();
    $("#change_owner_id_error").html('');
    $("#change_owner_succ_list").html('');
    $('#current_owner_id').html('<option value="">Owner Name</option>');
    $('#change_owner_list').html('<option value="">Owner Name</option>');
    $('.chosen-select').trigger('chosen:updated');
    var error_msg = "List id not found";
    var postData = $('#listManager').serializeArray();
    //list id validation 
    if(typeof list_id !='undefined' && list_id>0) {
        postData.push({name: "list_id", value: list_id});
    }else{
         alertPopup(error_msg, 'error');
    }

    $('#change_owner_btn').attr('disabled',false);
    $('#change_owner_btn').removeClass('btn-default');
    $("#hidden_change_list_id").val(list_id);
     $.ajax({
        url: '/offline/change-list-owner',
        type: 'post',
        dataType: 'json',
        data: postData,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:false,
        success: function (json) {
            console.log(json);
            if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }else if(typeof json['error'] !='undefined' && json['error']!=''){
               alertPopup(json['error'], 'error');
               
            }else if(typeof json['data']['error'] !='undefined' && json['data']['error']!=''){
                $('#changeOwnerListPopUp').trigger('click');
                $('#change_owner_id_error').addClass('error alert alert-danger');
                $("#change_owner_id_error").html(json['data']['error']);
               
            }else{
                    //change owner list
                    $('#changeOwnerListPopUp').trigger('click');
                    //get user list for owner
                    $('#change_owner_list').html(json['data']['change_owner_list']);
                    //current owner
                    $("#current_owner_id").prop("disabled", false);
                    if(json['frm_status'] == true){
                        $("#current_owner_id").prop("disabled", true);
                    }
                    $('#current_owner_id').html(json['data']['current_owner']);
                    $('#current_owner_id')[0].sumo.reload();
                    $('#change_owner_list')[0].sumo.reload();
                }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
 /*
 * This function will return all list name as per college id
 * @param {int} college_id
 * @returns {undefined}
 */
function getAllListnameByCollegeId(college_id,div_id,selected,report_type) {
    
    $.ajax({
        url: '/offline/getAllListnameByCollegeId',
        type: 'post',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {'college_id':college_id},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();

        },
        success: function (json) {
            if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }
            /*
            if(typeof json['error'] !='undefined' && json['error']!=''){
               alertPopup(json['error'], 'error');
            }
            */
           var $el = $('#'+div_id);
               $el.empty();
               if(div_id != 'segment-list') {
                    $el.append($("<option>List Name</option>").attr("value", ""));
                }    
            
            //If record found
            if(typeof json['data'] !='undefined' && json['data'] != '') { 
                $.each(json['data'], function(key, value) {
                    $el.append($("<option></option>")
                                   .attr("value",value['id'])
                                   .text(value['name']));
               });               
            } 
            $el.trigger("chosen:updated");
            if($.trim(selected)!='') {
               $el.val(selected).val();
               $el.trigger("chosen:updated");
            }
            if(div_id == 'segment-list') { 
                $('#'+div_id)[0].sumo.reload(); 
            }
            
            
            if(typeof report_type !== 'undefined' && report_type!='') {
                switch(report_type){
                    case 'view_reports':
                        LoadMoreViewReports('reset');
                        break;
                    case 'manage_contact':
                        LoadMoreContacts('reset');
                        break;
                        
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

 /*
 * This function will return all user who upload leads
 * @param {int} college_id
 * @returns {undefined}
 */
function getLeadUploadedUsers(college_id,div_id) {
    
    $.ajax({
        url: '/offline/get-owner-list-by-college-id',
        type: 'post',
        dataType: 'json',
		async: true,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {'college_id':college_id,uploadedUserList:1},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        },
        success: function (json) {
           if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }else if(typeof json['error'] !='undefined' && json['error']!=''){
               alertPopup(json['error'], 'error');
            }else if(typeof json['data']['sucess'] !='undefined' && json['data']['sucess']!=''){
                $('#'+div_id).html(json['data']['list']);
                $('#'+div_id+' > option:first-child').text('Imported By');
                $('#'+div_id).trigger('chosen:updated');
            }
           
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * This function use for display list ownere and current owner show
 * 
 * @returns {undefined}
 */
function updateOwnerlist(){
    $('#change_owner_id_error').removeClass('error alert alert-danger');
    $("#change_owner_succ_list").hide();
    $("#change_owner_id_error").html('');
    $("#change_owner_succ_list").html('');
    var postData = $('#updateChangeOwnerForm').serializeArray();
   
    $.ajax({
        url: '/offline/update-list-owner',
        type: 'post',
        dataType: 'json',
        data: postData,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:false,
        success: function (json) {
            if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }else if(typeof json['error'] !='undefined' && json['error']!=''){
               alertPopup(json['error'], 'error');
               
            }else if(typeof json['data']['data_error'] !='undefined' && json['data']['data_error']!=''){
                $('#change_owner_id_error').addClass('error alert alert-danger');
                $("#change_owner_id_error").html(json['data']['data_error']);
               
            }else{
                $("#hidden_change_list_id").val('');
                $("#change_owner_succ_list").show();
                $("#change_owner_succ_list").html(json['data']['sucess']);
                $('#current_owner_id').html('<option value="">Owner Name</option>');
                $('#change_owner_list').html('<option value="">Owner Name</option>');
                $('.chosen-select').trigger('chosen:updated');
                $('#change_owner_btn').attr('disabled',true);
                getOwnerListByCollegeId($("#s_college_id").val());
                LoadMoreOfflineLeads('reset');
            }
           },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
 /*   
 * This function will use for load data for View Reports section
 * @param {string} type
 * @returns {Boolean}
 */
function LoadMoreViewReports(type) {
    if (type == 'reset') {
        if($('#s_college_id').val()=='') {
			$('#LoadMoreArea, #table-data-view').hide();
            $('#if_record_exists').hide();
            $('#load_msg_div').show();            
            return false;
        }
        
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_results_msg').show("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('button[name="search_btn"]').attr('disabled','disabled');
    }
    var data = $('#manageContacts').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/offline/ajax-import-log',
        type: 'post',
        dataType: 'html',
        data: data,
		async: true,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function (xhr) {
            $('#listloader').show();
			$('button[name="search-btn"]').prop('disabled', true);
			$('.daterangepicker_report').prop('disabled', true);
        },
        success: function (data) {
            Page = Page + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            }
            else if (data == "error") {
                if(Page==1){
					$('#table-data-view').hide();
					$('#load_msg_div').show();
					$('#load_msg').html('No Records found');
				}
                else{
					$('#table-data-view').show();
					$('#load_msg_div').hide();
					$('#load_more_results_msg').html("<div class='margin-top-8 text-center text-danger fw-500'>No More Record</div>");
				}
                $('#load_more_button').hide();
                if (type != '' && Page==1) {
                      $('#if_record_exists').hide();
                }
            }else {
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
				$('#table-data-view').show();
				$('#load_msg_div').hide();
                data = data.replace("<head/>", '');
                if(Page==1) {
                    $('#load_more_results').append(data);
                    if(typeof jsVars.itemPerPage !='undefined' && $('#all_records_val').val() >= jsVars.itemPerPage
                    ){
                        $('#LoadMoreArea').show();
                        $('#load_more_button').show();                        
                    }
                    
                } else {
                    $('#load_more_results > tbody > tr:last').after(data);
                }
                
                $('#load_more_button').removeAttr("disabled");
                
                if(typeof jsVars.itemPerPage !='undefined' &&
                   $('#all_records_val').val() >= jsVars.itemPerPage
                  ){
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Reports");
                    $('#load_more_button').removeAttr("disabled");
                  } else {
                      $('#load_more_button').hide();
                  }                
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
				dropdownMenuPlacement();
                //determineDropDirection();
            }
			$('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
			$('button[name="search-btn"]').removeAttr('disabled');
			$('.daterangepicker_report').prop('disabled', false);
        }
    });
}
//this function use for rest values
function hidedata(){
    $("#if_record_exists").hide();
    $('#load_more_results').html("");
    $('#load_more_button').hide();
    $('#load_more_results_msg').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>Please select an Institute Name and click Search to view lists.</h4></div></div> </td></tr><tr></tr></tbody></table>");
    $("#form_id").html('<option value="0">Form</option>');
    $("#s_owner_id").html('<option value="">List Owner</option>');
    $('.chosen-select').trigger('chosen:updated');
    $('input[type="text"]').each(function () {
	//edit case for list name not blank
        if($(this).attr('id') != 'name'){
           $(this).val(''); 
        }
          
    });
}

/*
 * this fiunction use for get auto search tag list by college id
*/
$("#search_tag").keyup(function(){
    $("#addTagBtn").hide();
    var params='';
  $("#suggesstion-box").hide();
  $("#addTagBtn").hide();
  var search_tag = $(this).val(); 
  if(search_tag.length > 2){
       params =$("#params").val();
    
        $.ajax({
        url: '/offline/get-tag-list-auto-search',
        type: 'post',
        dataType: 'json',
        data: {search_common:search_tag,params:params, type:'raw_data'},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:false,
        success: function (json) {
            if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }else if(typeof json['error'] !='undefined' && json['error']!=''){
               alertPopup(json['error'], 'error');
               
            }else if(typeof json['data']['tag'] !='undefined' && json['data']['tag']!=''){
                if(typeof json['data']['count'] !='undefined' && json['data']['count']>0){
                    $("#suggesstion-box").show();
                    $("#suggesstion-box").html(json['data']['tag']);
                    $("#search-box").css("background","#FFF");  
                }else{
                    $("#addTagBtn").show();
                }
               
               
            }else{
                alertPopup("error", 'error');
            }
           
        }
        
      });  
  }else{
      return false;
  } 
 });
 
 
 //tag show on div
 var tagIns = [];
 function showTagOnDiv(tagid,tagname){
    var all_tag_id=$("#tag_id_val").val();
    var tag_array=all_tag_id.split(',');
     
     
    var added=false;
    if($.inArray(tagid,tag_array)>=0) {        
        added=true;
    }
    if(!added) {
       tagIns.push(tagid);
        $("#showtagdivid_"+tagid).addClass("disabled");
        $("#search_tag").val(tagname);
       var name ='<span class="tag label label-default remove_tag" onClick="removeTagId(\''+tagid+'\');" id=\'remove_tag_'+tagid+'\'>'+tagname+' <i aria-hidden="true" class="fa fa-times"></i><input value='+tagname+' type="hidden"></span>  ';
       $("#show_tag_list").append(name);
       $("#tag_id_val").val(tagIns.join(','));
    }
     suggesstionbox();
 }
 //remove show tag form div
 function removeTagId(removetagid){
     suggesstionbox();
     tagIns = jQuery.grep(tagIns, function(value) {
      return value != removetagid;
    });
    $("#remove_tag_"+removetagid).remove();
    $("#tag_id_val").val(tagIns.join(','));
   
 }
 //hide  suggesstionbox
 function suggesstionbox(){
     $("#search_tag").val('');
     $("#suggesstion-box").hide();
     $("#suggesstion-box").html('');
     
 }
 //add new tag
 function addNewTag(){
     var tagname ='';
      $("#addTagBtn").show();
     var params =$("#params").val();
     var add_search_tag =$("#search_tag").val();
//     alert(add_search_tag.length);
     $.ajax({
        url: '/offline/add-new-tag',
        type: 'post',
        dataType: 'json',
        data: {name:add_search_tag.toLowerCase(),params:params, module:'raw_data'},
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:false,
        success: function (json) {
            if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }else if(typeof json['error'] !='undefined' && json['error']!=''){
               alertPopup(json['error'], 'error');
               
            }else if(typeof json['data']['sucess'] !='undefined' && json['data']['sucess']!=''){
                    $("#addTagBtn").hide();
                    showTagOnDiv(json['data']['id'],json['data']['name']);
                    $("#search_tag").val('');
                    
            }else{
                alertPopup("error", 'error');
            }
           
        }
        
      });
 }
 
 //get owner list by college id
 function getOwnerListByCollegeId(college_id){
     if(college_id.length <= 0) {
        return false;
      }
     $.ajax({
        url: '/offline/get-owner-list-by-college-id',
        type: 'post',
        dataType: 'json',
        data: {
            "college_id": college_id
         },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:true,
        success: function (json) {
           if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }else if(typeof json['error'] !='undefined' && json['error']!=''){
               alertPopup(json['error'], 'error');
            }else if(typeof json['data']['sucess'] !='undefined' && json['data']['sucess']!=''){
                $('#s_owner_id').html(json['data']['list']);
                $('#s_owner_id').trigger('chosen:updated');
				$('#search_common').prop('disabled', false);
				$('#search_common').parent('.input').addClass('enabled');
            }
			
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
 }

/**
 * This function is use for Manage Contacts Section
 * @param {string} type
 * @returns {Boolean}
 */
function LoadMoreContacts(type) {
    
    if (type == 'reset') { 
        if($('#s_college_id').val()=='') {
            $('#load_more_results').html('');
            $('#if_record_exists, #summary_data').hide();
            //$('#load_more_results_msg').html('');
            $('#load_more_results').html("<table><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center'>Please select an Institute name and list name and click search to view contacts.</h4></div></div></td></tr><tr></tr></tbody></table>");            
            return false;
        } else if($('#s_college_id').val() >0 && $('#list_id').val()=='' || $('#list_id').val()==null){
            $('#load_more_results').html('');
            $('#if_record_exists, #summary_data').hide();
            //$('#load_more_results_msg').html('');
            $('#load_more_results').html("<table><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center'>Please select list name and click search to view contacts.</h4></div></div></td></tr><tr></tr></tbody></table>");            
            return false;
        }
        
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_results_msg').show("");
        $('#load_more_button, #if_record_exists, #summary_data').show();
        $('#load_more_button').html("Loading...");
        $('button[name="search_btn"]').attr('disabled','disabled');
        
        //Load Summary section
        getManageContactsSummaryData('manage_contact_summary');
        is_filter_button_pressed = 1;
    }
    var data = $('#manageContacts').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/offline/ajax-manage-contacts',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        success: function (data) {
            $('button[name="search_btn"]').removeAttr('disabled');
            Page = Page + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            }
            else if (data == "error") {
                if(Page==1)error_html="No Records found";
                else error_html="No More Record";
                $('#load_more_results_msg').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>"+error_html+"</h4></div></div> </td></tr><tr></tr></tbody></table>");
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Contacts");
                $('#load_more_button').hide();
                  if (type != '' && Page==1) {
                        $('#if_record_exists').hide();
                  }
            }else {
                
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
                data = data.replace("<head/>", '');
                //$('#load_more_results').append(data);
                
                if(Page==1) {
                    $('#load_more_results').append(data);
                    
                    if(typeof jsVars.itemPerPage !='undefined' && $('#all_records_val').val() >= jsVars.itemPerPage
                    ){
                        $('#LoadMoreArea').show();
                        $('#load_more_button').show();                        
                    }
                } else {
                    $('#load_more_results > tbody > tr:last').after(data);
                }
                
                $('#load_more_button').removeAttr("disabled");
                
                if(typeof jsVars.itemPerPage !='undefined' &&
                   $('#all_records_val').val() >= jsVars.itemPerPage
                  ){
                    
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Contacts");
                    $('#load_more_button').removeAttr("disabled");
                    
                    // if select all then all checkbox is selected
                    if($('#select_all:checked').length>0) {
                        selectAllCheckbox(document.getElementById('select_all'));
                    }
                    
                  } else {
                      $('#load_more_button').hide();
                  }                
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
                
				dropdownMenuPlacement();
//                $.material.init();
                table_fix_rowcol();
            }
			if($('#summary_data').length){
				var summaryDataPos = jQuery('#summary_data').offset().top - 70;
				$("html, body").animate({ scrollTop: summaryDataPos }, 500);
			}
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });
}

/*
 * select filter for get value form url
 */
function filterSelectFromUrl() {
    //get filter from url varaibles
    var filterOption = jsVars.filterOption;//only all filter key
    var url_filter = jsVars.url_filter;// all filter array with key=>value
    if (filterOption.length > 0) {//check length of filter array
        for (var i = 0; i < filterOption.length; i++) {
            var key = filterOption[i];
            if ($('input[name="' + key + '"]').length) {//text box
                $('input[name="' + key + '"]').val(url_filter[filterOption[i]]);
            } else if ($('select[name="' + key + '"]').length) {//dropdown
                $('select[name="' + key + '"]').val(url_filter[filterOption[i]]);
            }
            $('select').trigger('chosen:updated');//update dropdown
        }
    }
    callTrigger("id", "searchList");//call search button tigger
}
/*
 * function user for tigger call
 * attrtype means id or class
 * attrname  id or classs name
 * 
 */
function callTrigger(attrtype, attrname) {
    var t = '';
    if (attrtype == 'id') {
        t = $("#" + attrname)
    } else if (attrtype == 'class') {
        t = $("." + attrname)
    } else {
        t = attrtype;
    }

    t.trigger('click');
}
    /**
     * This function will return data for Manage Contacts Page Registration section
     * @returns {Boolean}
     */
    function getManageContactsSummaryData(action){
        //$('#apply_filter').trigger('click');
        var data = $('#manageContacts').serializeArray();
        data.push({name: "action", value: [action]});
        $.ajax({
           url: '/offline/ajaxAction',
           type: 'post',
           dataType: 'json',
           data: data,
           //async:false,
           headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
           success: function (json) {
               
              if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
                  window.location.reload(true);
               }else if(typeof json['error'] !='undefined' && json['error']!=''){
                  alertPopup(json['error'], 'error');
               }else if(typeof json['status'] !='undefined' && json['status']!='' &&
                        typeof json['data'] !='undefined' && json['data']!=''){
                        $('#span_list_name').html(json['data']['list_name']);
                        $('#span_owner_name').html(json['data']['list_owner']);
                        if(json['data']['mobileFilterShow']){
                            $('#mobile_status_filter').show();
                            $('.MobileStatus').show();
                        } else {
                            $('#mobile_status_filter').hide();
                            $('.MobileStatus').hide();
                        }
                        var total=0;
                        var total_unique_email=0;
                        var total_unique_mobile=0;
                        var total_registered_mobile=0;
                        var total_unique_registered_mobile=0;
                        var total_unregistered_mobile=0;
                        if(typeof json['data']['contactCountData']['total'] !=='undefined') {
                            total = json['data']['contactCountData']['total'];
                        }
                        if(typeof json['data']['contactCountData']['total_unique_email'] !=='undefined') {
                            total_unique_email = json['data']['contactCountData']['total_unique_email'];
                        }
                        if(typeof json['data']['contactCountData']['total_unique_mobile'] !=='undefined') {
                            total_unique_mobile = json['data']['contactCountData']['total_unique_mobile'];
                        }
                        if(typeof json['data']['contactCountData']['total_registered_mobile'] !=='undefined') {
                            total_registered_mobile = json['data']['contactCountData']['total_registered_mobile'];
                        }
                        if(typeof json['data']['contactCountData']['total_unique_registered_mobile'] !=='undefined') {
                            total_unique_registered_mobile = json['data']['contactCountData']['total_unique_registered_mobile'];
                        }
                        if(typeof json['data']['contactCountData']['total_unregistered_mobile'] !=='undefined') {
                            total_unregistered_mobile = json['data']['contactCountData']['total_unregistered_mobile'];
                        }
                        
                        $('#span_contact_data').html('Total Contacts : <strong>'+total+'</strong> &nbsp;Unique Email ID Count : <strong>'+total_unique_email
                              +'</strong> &nbsp;Unique Mobile Number Count : <strong>'+total_unique_mobile+'</strong>');
                      
                        $('#span_mobile_data').html('Total Registered : <strong>'+total_registered_mobile
                              +'</strong> &nbsp;Unique Registered : <strong>'+total_unique_registered_mobile+'</strong>&nbsp;\n\
                                Not Registered : <strong>'+total_unregistered_mobile+'</strong>');
                        
                        var register_data='';
                        register_data+='Not Registered : <strong>'+json['data']['registrationData']['total_not_registered']+'</strong> &nbsp;';
                        register_data+='Verified : <strong>'+json['data']['registrationData']['total_verified']+'</strong> &nbsp;';
                        register_data+='Unverified : <strong>'+json['data']['registrationData']['total_unverified']+'</strong> &nbsp;';
                        
                        var tooltip='<a class="icon-info" tabindex="0" style="margin:-1px 9px 0 1px;display:inline-block;vertical-align:middle;font-size: 14px;" role="button" data-toggle="popover" data-trigger="focus" data-placement="top" title="Existing Leads" data-container="body" data-content="This count represents leads present in the LMS when a new CSV file is uploaded in a list."><i class="lineicon-info" aria-hidden="true"></i><a/>';
                        register_data+='Existing Leads : <strong>'+json['data']['registrationData']['already_registered']+'</strong>'+tooltip;
                        
                        $('#span_register_data').html(register_data);
               }
               
               //For Filter Column
               if(typeof json['sucess'] !='undefined' && json['sucess']!='' &&
                        typeof json['column_heading_data'] !='undefined' && json['column_heading_data']!=''){                    
                    var html='';
                    var outer_counter=0;
                    $.each(json['column_heading_data']['column'], function(key, value) {
                        outer_counter++;
                        var inner_counter=0;
                        html+='<h2>'+value['heading']+'</h2><ul id="databases">';
                            $.each(value['field_list'], function(li_key, li_value) {                                
                                var checked_html='';
                                if(li_value['checked'] == 'checked'){
                                    checked_html='checked="checked"';
                                }
                                html+='<li><label for="column_create_keys_'+outer_counter+'_'+inner_counter+'"><input type="checkbox" id="column_create_keys_'+outer_counter+'_'+inner_counter+'" name="column_create_keys[]" value='+li_value['column_name']+' data-label_name="'+li_value['heading_name']+'" class="column_create_keys" '+checked_html+'>'+li_value['heading_name']+'</label></li>';
                                inner_counter++;
                            });
                        html+='</ul>';
                   });
                   $('#column_li_list').html(html);
               }
               
           },
           error: function (xhr, ajaxOptions, thrownError) {
               console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           }
       });
    }

function filter(element,listid) {
    
    var value = $(element).val();
    value = value.toLowerCase();
    
    $("ul#"+listid+"  li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
//            $(this).text(src_str);
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}


function showAdvancedFilerInContactModule(){
    $('#advanced_filter').show();
}


function segmentList(collegeId){
    if(typeof collegeId == 'undefined' || collegeId == "" ||  collegeId == 0) {
        alertPopup('Please select college.', 'error');
        return false;
    }
    
    $.ajax({
        url: '/offline/getAllListnameByCollegeId',
        type: 'post',
        dataType: 'json',
        data: {"college_id": college_id},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();

        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:false,
        success: function (json) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}

/**
 * segment LoadMoreSegments
 * @param {type} type
 * @returns {Boolean}
 */
function LoadMoreSegments(type) {
    //$('#listloader').show();
    if($('#s_college_id').val()<=0) {
      //$('#load_more_results > tr > td > div > div').html("<div class='alert'>Please click search button to view Segment.</div>");
        $('#load_more_button').hide();
        $('#load_more_button').html("Load More Segments");
         if (type != '') {
                $('#if_record_exists').hide();
         }
         $('#listloader').hide();
         return false;
    }
    
    if (type == 'reset') {
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_results_msg').show("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('button[name="search_btn"]').attr('disabled','disabled');
        
        var d = new Date();
        var hours = d.getHours();
        var ampm = hours >= 12 ? ' PM' : ' AM';
        var day=(d.getDate()<10)?'0'+d.getDate():d.getDate();
        
        var current_month=d.getMonth()+1; //Because start from 0
        var month=(current_month<10)?'0'+current_month:current_month;
        
        var hours=(d.getHours()<10)?'0'+d.getHours():d.getHours();
        var minute=(d.getMinutes()<10)?'0'+d.getMinutes():d.getMinutes();
        //$('#lastRefreshTime').html(day+'/'+month+'/'+d.getFullYear()+' '+hours+':'+minute + ampm);
    }
    var data = $('#segmentManager').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/offline/ajax-segment-list',
        type: 'post',
		async: true,
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function(xhr){
            $('#listloader').show();
			$('button[name="search-btn"]').prop('disabled', true);
			$('.daterangepicker_report').prop('disabled', true);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
			$('button[name="search-btn"]').removeAttr('disabled');
			$('.daterangepicker_report').prop('disabled', false);
        },
        success: function (data){
            Page = Page + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            }
            else if (data == "error"){
                if(Page>1) {
					$('#table-data-view').show();
                    $('#load_more_results_msg').html('<div class="text-center text-danger fw-500"><small>No More Record</small></div>');
                } else {
					$('#load_msg_div').show();
					$('#table-data-view').hide();
                    $('#load_msg').html('No record found');
                }
                //$('#load_more_button').html("Load More Segments");
                $('#load_more_button').hide();
                  if (type != '' && Page==1) {
                        $('#if_record_exists').hide();
                  }
            }else if(data == 'permision_denied'){
				window.location.href= '/permissions/error';
            }else {
                
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
                data = data.replace("<head/>", '');
				$('#load_msg_div').hide();
				$('#load_more_results_msg').html('');
                $('#table-data-view').show();
                if(Page==1) {
                    $('#load_more_results').append(data);
                    
                    if(typeof jsVars.itemPerPage !='undefined' && $('#all_records_val').val() >= jsVars.itemPerPage
                    ){
                        $('#LoadMoreArea').show();
                        $('#load_more_button').show();                        
                    }
                } else {
                    $('#load_more_results > tbody > tr:last').after(data);
                }
                
                $('#load_more_button').removeAttr("disabled");
                if(typeof jsVars.itemPerPage !='undefined' &&
                   $('#all_records_val').val() >= jsVars.itemPerPage
                  ){
                    $('#load_more_button').html("Load More Segments");
                    
                    // if select all then all checkbox is selected
                    if($('#select_all:checked').length>0) {
                        selectAllCheckbox(document.getElementById('select_all'));
                    }
                    
                  } else {
                      $('#load_more_button').hide();
                  }                
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
                //$.material.init();
                //table_fix_rowcol();
				$('#createAutomationListPopupArea .close').removeClass('npf-close');
                dropdownMenuPlacement();
                //determineDropDirection();
				$('#actionList').show();
            }
			$('.offCanvasModal').modal('hide');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
    return false;
}
/*
* add edit segment
*/
function AddEditCreateSegment(){
    return false;
}
    
//Set value in dropdown in Advanced Filter and display input box for that row
function renderFields(elem) {
    value_field = elem.value;
    var arr = value_field.split("||");
    type = "";
    if (arr.length ===2) {
        var field_name = arr[0];
        var type = arr[1];
        
        
        var div_id=$(elem).parents(".more_criteria").attr('id');
        var dataTypeList='';
        if(type=='integer') {
            dataTypeList=jsVars.integerDataTypeLabel;
        } else if(type=='date') {
            dataTypeList=jsVars.dateDataTypeLabel;
        } else if(type=='varchar') {
            dataTypeList=jsVars.varcharDataTypeLabel;
        } else if(type=='selectbox') {
            dataTypeList=jsVars.selectboxDataTypeLabel;
        }

        var $el=$('#'+div_id).find('div.second_column > select');
        $el.empty();
        $el.append($("<option>Condition</option>").attr("value", ""));
        
        $.each(dataTypeList, function(key, value) {
            $el.append($("<option></option>")
                           .attr("value",key)
                           .text(value));
       });               
        
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        $el.trigger('chosen:updated');
        
        //Always Set 3rd Field input bod bydefault
        var $third_obj=$('#'+div_id).find('div.third_column');
        $third_obj.empty();
        $third_obj.html('<input type=\'text\' class=\'form-control\' name=\'advanced_filter[condition_value][]\' value=\'\' placeholder=\'\'  disabled="disabled"/>');        
    }
    
    if (type == "date") {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    }
}

/**
 * Display third Input box in Manage Contact Advanced Filter Page
 * @param {type} elem
 * @returns {undefined}
 */
function showHideInputBoxInAdvancedFilter(elem) {
    //console.log(elem.value);
    //return;
    var div_id=$(elem).parents(".more_criteria").attr('id');
    var $el=$('#'+div_id).find('div.third_column');
    
    var html='';
    var load_date='';
    switch(elem.value){
        case 'blank':
        case 'not_blank': 
            //$el.empty();
            html="<input type='hidden' class='form-control ' name='advanced_filter[condition_value][]' value='' placeholder=''>";
            break;
        case 'between':
            html = "<input type='text' class='form-control daterangepicker_report' name='advanced_filter[condition_value][]' readonly='readonly' value='' placeholder=''>";
            load_date=1;
            break;
        case 'before':
        case 'after':
            html = "<input type='text' class='form-control datepicker_report' name='advanced_filter[condition_value][]' readonly='readonly' value='' placeholder=''>";
            load_date=1;
            break;
        default:
            //get the first selected dropdown value
            var first_dropdown_val=$('#'+div_id).find('div.first_column > select').val();
            var arr = first_dropdown_val.split("||");
            var field_name=arr[0];
            var selectID='';
            
            switch(field_name){
                case 'created_by':                       
                        html='<select name="advanced_filter[condition_value][]" class="chosen-select" style="display:block;"></select>';
                        selectID='created_by';
                    break;                       
                case 'stage':                        
                        html='<select name="advanced_filter[condition_value][]" class="chosen-select" style="display:block;"></select>';
                        selectID='lead_stage';
                    break;                    
                case 'registration_status':                        
                        html='<select name="advanced_filter[condition_value][]" class="chosen-select" style="display:block;"></select>';
                        selectID='registration_status';
                    break;
                case 'mobile_registration_status':                        
                        html='<select name="advanced_filter[condition_value][]" class="chosen-select" style="display:block;"></select>';
                        selectID='mobile_registration_status';
                    break;
                case 'bounce_sms':                        
                        html='<select name="advanced_filter[condition_value][]" class="chosen-select" style="display:block;"></select>';
                        selectID='bounceSMSStatus';
                    break;
                case 'bounce_email':                        
                        html='<select name="advanced_filter[condition_value][]" class="chosen-select" style="display:block;"></select>';
                        selectID='bounceEmailStatus';
                    break;
                default:
                    html = "<input type='text' class='form-control ' name='advanced_filter[condition_value][]' value='' placeholder=''>";
                    break;
            }
            break;
    }
    $el.html('');
    $el.html(html);
    
    if(selectID!='') {
        $('#'+selectID + ' > option').clone().appendTo($('#'+div_id).find('div.third_column >select'));
        
        $('.chosen-select').chosen();
        //$('.chosen-select-deselect').chosen({allow_single_deselect: true});
    }
    
    //if load_date (Means Date Filter) is 1 then load calendar
    if (load_date == 1) {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    } 
}


/*
 * get segments owner list by collgeg id
 */
function getSegmentOwnerListByCollegeId(college_id,hidedatafrm){
    if(hidedatafrm == 'hidedata'){
         hidedataSegment();//REST FORM 
    }
     if(college_id.length <= 0) {
         $("a.mange-segment-create").attr("href", '/offline/create-segment');
        return false;
      }
     $.ajax({
        url: '/offline/get-segment-owner-list-by-college-id',
        type: 'post',
        dataType: 'json',
        data: {
            "college_id": college_id
         },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:true,
		 beforeSend: function(xhr){
            $('#listloader').show();
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        },
        success: function (json) {
           if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }else if(typeof json['error'] !='undefined' && json['error']!=''){
               alertPopup(json['error'], 'error');
            }else if(typeof json['data']['sucess'] !='undefined' && json['data']['sucess']!=''){
                $('#s_owner_id').html(json['data']['list']);
                $('#s_owner_id').trigger('chosen:updated');
                $("a.mange-segment-create").attr("href", '/offline/create-segment/'+json['encoded_string']);
				$('#search_common').prop('disabled', false);
				$('#search_common').parent('.input').addClass('enabled');
            }
           
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
 }
 //this function use for rest values segments
function hidedataSegment(){
    $("#if_record_exists").hide();
    $('#load_more_results').html("");
    $('#load_more_button').hide();
    $('#load_msg').html('Please select an Institute Name from filter and click apply to view Segments.');
    $("#s_owner_id").html('<option value="">Segment Owner</option>');
    $('.chosen-select').trigger('chosen:updated');
    $("#btn_segment_search").attr("disabled",false);
    $('input[type="text"]').each(function () {
	 $(this).val(''); 
     });
   }
function segmentRemoveRow(row, container){
    $('div[data-group="'+row+'"][data-attr="'+container+'"]').remove();
}

function confirmDelete(row){
    $('#ConfirmMsgBody').html('Are you sure you want to delete selected criteria?');
    $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
        .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
        e.preventDefault();
        var segment_group_more_val = $("input[name='segment-group-more']:checked").val();
        $('div[data-group-copy="'+row+'"]').remove();
        $('div[data-group="'+row+'"]').remove();
        $('#ConfirmPopupArea').modal('hide');
        // To update the segment-group-more value because after delting the value has become null
        $("input[name='segment-group-more']").val(segment_group_more_val);
        // to show add more container button
        if($('.outer-group-container').length < 4){
            $(".make-outer-copy").show();
        } 
    });
    
}

function createSegmentCollegeChange(college_id){
    $("#total_records").html('0');
    
    //If college id is blank then empty list 
    if(college_id=='') {
        var $el = $('#segment-list');
        $el.empty();
        $el.trigger("chosen:updated");        
        $('#segment-list')[0].sumo.reload();         
        return false;
    }
    getAllListnameByCollegeId(college_id,"segment-list","");
    
    $.ajax({
        url: '/offline/ajaxGetLists',
        type: 'post',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data: {'college_id':college_id},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        },
        success: function (json) {
            if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }else if(typeof json['status'] != 'undefined' && json['status'] == 200){
                $('.segment-lable').empty();
                $('.segment-lable').append(json['labelList']);
                $(".segment-lable").trigger('chosen:updated');
            }
            $('.inner-criteria-container:not(:first)').remove();
            $('.segment-list-error').remove();
            
            $('.uploadedBy').empty();
            $.each(json['upload_id'], function(key, value) {
                $('.uploadedBy').append($("<option></option>").attr("value",value.uploaded_by).text(value.name));
            });
            json['upload_id'];
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
/*For Delete Segmen List Action*/
function deleteSegmentAction(elem,max_checkbox_checked,type,id){
     if(type!='single' && isMultipleCheckboxChecked(elem,max_checkbox_checked)==false) {
        alertPopup('Select more than one list', 'error');
    } else {
        collegeId=$('#s_college_id').val();
        if(typeof collegeId == 'undefined' || collegeId == "" ||  collegeId == 0) {
            alertPopup('Please select institute name.', 'error');
            return false;
        }
        if(type=='single') { //If type is single then pass the list_id
            var all_ids=id;
        } else {
            var all_ids=getAllCheckedValue('selected_users[]');
        }
        var data = $('#segmentManager').serializeArray();
        data.push({name: "id_segment", value: all_ids});
        data.push({name: "action", value: 'delete'});
        $("#confirmYes").removeAttr('onclick');
        $('#confirmTitle').html("Confirm Delete action");
        $("#confirmYes").html('Ok');
        $("#confirmYes").siblings('button').html('Cancel');

        $('#ConfirmMsgBody').html('Are you sure you want to delete selected segment?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: '/offline/delete-segment-name',
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('div.loader-block').show();
                    },
                    complete: function () {
                        $('div.loader-block').hide();
                    },
                    success: function (json) {
                        if (typeof json['redirect'] !='undefined' && json['redirect'] !='') {
                            alertPopup(json['error'], 'error','/offline/manage-segment');
                        } else if (typeof json['error'] !='undefined' && json['error'] !='') {
                            alertPopup(json['error'], 'error');
                        } else if (typeof json['status'] !='undefined' && json['status'] == 200) {                            
                            alertPopup( json['message'], "success");
                            LoadMoreSegments('reset');
                        }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
                    }
                });
                $('#ConfirmPopupArea').modal('hide');
            });
        return false;
    }
}

/**
 * THis function is for manage list Contact Page which will open the modal box and save data using Ajax
 * This will use for multipl action as per parameter
 * @param (string) val
 * @returns {undefined}
 */
function manageContactAction(action,type,contact_id){
    var postData='';
    var loadPopup=0;
    if(typeof type !='undefined' && (type=='add')){ //This will
        $('.show_err').html('');
        $('#manage_contact_other_id_error').removeClass('error alert alert-danger');
        $("#message_div").hide();//hide message
        
        switch(action){
            case 'change_lead_stage':
                    postData = $('#manageContacts').serializeArray();
                    postData.push({name: "lead_stage_id", value: $('#lead_stage_id').val()});
                    postData.push({name: "saveType", value: $('#saveType').val()});
                    postData.push({name: "stage_note", value: $('#stage_note').val()});
                    postData.push({name: "action", value: 'change_lead_stage'});
                    
                    if(typeof $('#current_lead_stage').val() != 'undefined') {
                        postData.push({name: "current_lead_stage", value: $('#current_lead_stage').val()});
                    }
                    
                    if(contact_id!='') { //For Single Lead Stage
                        postData.push({name: "contact_id", value: contact_id});
                    }
                break;
            case 'add_contact':                
            case 'edit_contact':                
                    postData = $('#addContact').serializeArray();
                    postData.push({name: "s_college_id", value: $('#s_college_id').val()});
                    if($('#list_id').length>0) {
                        postData.push({name: "list_id", value: $('#list_id').val()});
                    } else if($('#segment_id').length>0) {
                        postData.push({name: "segment_id", value: $('#segment_id').val()});
                    }
                    
                    if(action=='edit_contact') {
                        postData.push({name: "action", value: 'edit_contact'});
                        postData.push({name: "contact_id", value: contact_id});
                    } else {
                        postData.push({name: "action", value: 'add_contact'});
                    }
                    
                break;
            case 'add_note': //For add note               
                    postData = $('#addNote').serializeArray();
                    postData.push({name: "s_college_id", value: $('#s_college_id').val()});
                    postData.push({name: "list_id", value: $('#list_id').val()});
                    postData.push({name: "contact_id", value: contact_id});
                    postData.push({name: "action", value: 'add_note'});
                break;
            case 'add_tag': //For Tag
                    postData = $('#addTag').serializeArray();
                    postData.push({name: "s_college_id", value: $('#s_college_id').val()});
                    postData.push({name: "list_id", value: $('#list_id').val()});
                    postData.push({name: "contact_id", value: contact_id});
                    postData.push({name: "tag_id_val", value: $('#tag_id_val').val()});
                    postData.push({name: "action", value: 'add_tag'});
                break;
            case 'list_add_tag': //For list add Tag
                    postData = $('#addTag').serializeArray();
                    postData.push({name: "s_college_id", value: $('#s_college_id').val()});
                    postData.push({name: "list_id", value: contact_id});
                    postData.push({name: "tag_id_val", value: $('#tag_id_val').val()});
                    postData.push({name: "action", value: 'list_add_tag'});
                    $('#tag_id_val').val('');//for blank value
                break;
        }
        
    } else { //When display the popup         
        $('#manage_contact_other_id_error').removeClass('error alert alert-danger');
        jQuery('#showManageContactActionContainer').html('loading...');
        loadPopup=1; 
        $('#manage_contact_heading, #manage_contact_message_div').removeClass("alert alert-success").html(''); //Blank these field 
        switch(action){
            case 'change_lead_stage':
                postData = $('#manageContacts').serializeArray(); 
                if(contact_id!='') {
                    postData.push({name: "contact_id", value: contact_id});
                    //Set action to change_lead_stage
                    $('#add_edit_lead_stage').attr('onclick','manageContactAction(\'change_lead_stage\',\'add\',\''+contact_id+'\');');
                } else {    
                    if(getAllCheckedValue('selected_users[]')=='') {
                        alertPopup('You must select contact to change lead stage.', "error");
                        return false;
                    }
                }
                
                $('#change_status_div').show();
                $('#add_contact_div').hide();
                $('#add_note_div').hide();
                $('#add_tag_div').hide();
                $('#manage_contact_heading').html("Change Lead Stage");                
                $("#stage_note").val("");
                break;
            case 'add_contact':
            case 'edit_contact':
                    postData = $('#manageContacts').serializeArray(); 
                    if(action=='add_contact') {
                        if($.trim($('#list_id').val())=='' || $.trim($('#list_id').val())=='') {
                            alertPopup('College and list name must be selected to create new contact.', "error");
                            return false;
                        }

                        $('#manage_contact_heading').html("Add Contact");
                        $("#stage_note").val("");
                        $('#add_edit_new_contact').attr('onclick','manageContactAction(\'add_contact\',\'add\',\'\');');
                    } else if(action=='edit_contact') {
                        $('#manage_contact_heading').html("Edit Contact");
                        postData.push({name: "contact_id", value: contact_id});
                        //Set action to edit_contact
                        $('#add_edit_new_contact').attr('onclick','manageContactAction(\'edit_contact\',\'add\',\''+contact_id+'\');');
                    }

                    //$('#change_status_div').remove(); //Remove these div
                    //$('#manage_contact_modal_width_id').css("width","1000px");
                    $('#add_contact_div').show();
                    $('#change_status_div').hide();
                    $('#add_note_div').hide();
                    $('#add_tag_div').hide();
                break;     
            case 'add_note':
                postData = $('#manageContacts').serializeArray(); 
                postData.push({name: "contact_id", value: contact_id});
                
                //Set action to add_note
                $('#add_edit_note').attr('onclick','manageContactAction(\'add_note\',\'add\',\''+contact_id+'\');');
                
                $('#add_note_div').show();
                $('#add_contact_div').hide();
                $('#change_status_div').hide();
                $('#add_tag_div').hide();
                $('#manage_contact_heading').html("Add Note");                
                $("#new_note").val("");
                break;
            case 'add_tag': //For Add/Edit New Tag
                $('#tag_id_val').val(''); //Blank this tag
                
                postData = $('#manageContacts').serializeArray(); 
                postData.push({name: "contact_id", value: contact_id});
                //Set action to add_note
                $('#add_edit_tag').attr('onclick','manageContactAction(\'add_tag\',\'add\',\''+contact_id+'\');');
                
                $('#add_tag_div').show();
                $('#add_note_div').hide();
                $('#add_contact_div').hide();
                $('#change_status_div').hide();
				$('#manage_contact_modal_width_id').css('width', '420px');
                $('#manage_contact_heading').html("Add Tag");                
                $('#show_tag_list').html("");                
                $("#new_note").val("");
                break;
            case 'list_add_tag': //For Add/Edit New Tag
                tagIns = [];
                $('#tag_id_val').val(''); //Blank this tag
                postData = $('#listManager').serializeArray(); 
                postData.push({name: "list_id", value: contact_id});
                //Set action to add_note
                $('#add_edit_tag').attr('onclick','manageContactAction(\'list_add_tag\',\'add\',\''+contact_id+'\');');
                $('#add_tag_div').show();
                $('#add_note_div').hide();
                $('#add_contact_div').hide();
                $('#change_status_div').hide();
				$('#manage_contact_modal_width_id').css('width', '420px');
                $('#manage_contact_heading').html("Add Tag");                
                $('#show_tag_list').html("");                
                $("#new_note").val("");
                $("#suggesstion-box").html('');
                $("#search_tag").val("");
                break;
        }
        postData.push({name: "action", value: action});
    }    
    
    $.ajax({
       url: '/offline/manageContactAction',
       type: 'post',
       dataType: 'json',
       data: postData,
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function (xhr) {
            $('#listloader').show();
        },
       success: function (json) {
           if((typeof json['session_error'] !='undefined' && json['session_error']=='session_logout') || 
              (typeof json['token_error'] !='undefined' && json['token_error']=='token_error')){
               window.location.reload(true);
           }
           
           if(loadPopup==1) { //This will execute when popup will open
               var isThereAnyError=0;
               if(json['data'] != '') {                    
                    switch(action){
                        case 'change_lead_stage':
                            //For Single Lead Stage
                            if(contact_id!='') {
                                $('#current_lead_stage_id').show();
                                var $el = $('#current_lead_stage');
                                $el.empty();                                
                                $.each(json['data']['current_lead_stage'], function(key, value) {   
                                    $el.append($("<option></option>")
                                                   .attr("value",key)
                                                   .text(value));
                               });
                               $el.trigger("chosen:updated");
                            }
                            
                            var $el = $('#lead_stage_id');
                            $el.empty();
                            $el.append($("<option>Lead Stage</option>").attr("value", ""));
                            $.each(json['data']['lead_stage'], function(key, value) {   
                                $el.append($("<option></option>")
                                               .attr("value",key)
                                               .text(value));
                           });
                           $el.trigger("chosen:updated");
                            
                       break;
                       case 'add_contact':
                       case 'edit_contact':
                           var $el = $('#show_all_label');                           
                            $el.empty(); 
                            var html='';
                            if(typeof json['data']['column_mapping_list'] != 'undefined' && json['data']['column_mapping_list']!=false) {
                                var email='';
                                var mobile_no='';
                                var default_dial_code = json['data']['default_country'];
                                var contact_data='';
                                var totalDateField=0; //When data type is date then increase this value by 1
                                var disableDialCode = '';
                                var isDialCodeExist = false;
                                if(action=='edit_contact') {
                                    if(typeof json['data']['edit_contact_data'] != 'undefined' && json['data']['edit_contact_data']!='') {
                                        contact_data=json['data']['edit_contact_data'];
                                        
                                        //email=json['data']['edit_contact_data']['email'];
                                        //mobile_no=json['data']['edit_contact_data']['mobile_no'];
                                        
                                        if(typeof contact_data['dial_code'] !== 'undefined' ) {
                                            isDialCodeExist = true;
                                            
                                            if(contact_data['dial_code'] !== '') {
                                                var default_dial_code = '+'+contact_data['dial_code'];
                                                disableDialCode = 'disabled="disabled"';
                                            }
                                        }
                                    }
                                }
                                var country_dial_code ='';
                                if(typeof json['data']['dial_code_list'] != 'undefined' && json['data']['dial_code_list']!='') {
                                    country_dial_code+='<div class="merge_field_div" style="width:70px;float:left;" >';
                                    //country_dial_code+='<label class="control-label widget_label">Dial Code</label>';
                                    country_dial_code+='<div class="input-group">';
                                    country_dial_code+='<div class="input-group-btn bs-dropdown-to-select-group">';
                                    country_dial_code+='<button type="button" '+disableDialCode+' class="btn btn-default dropdown-toggle as-is bs-dropdown-to-select" data-toggle="dropdown">';
                                    country_dial_code+='<span data-bind="bs-drp-sel-label">'+default_dial_code+'</span>';
                                    country_dial_code+='<input type="hidden" name="new_contact[dial_code]" id="dial_code" data-bind="bs-drp-sel-value" value="'+default_dial_code+'">';
                                    if(isDialCodeExist){
                                        country_dial_code+='<input type="hidden" name="new_contact[hidden_dial_code]" id="hidden_dial_code" value="'+contact_data['dial_code']+'" />';
                                    }
                                    country_dial_code+='<span class="caret"></span><span class="sr-only">Toggle Dropdown</span>';
                                    country_dial_code+='</button>';
                                    country_dial_code+='<div class="dropdown-menu" class="show_dial_code_option">';
                                    country_dial_code+='<input type="text" name="filter" class="search_box_code widget_input" onkeyup="javascript:filterDialCode()" id="filter_dial_code">';
                                    country_dial_code+='<ul class="dropdown-menu-list" role="menu" id="ul_dial_code">';

                                    $.each(json['data']['dial_code_list'], function(key, country_data) {
                                        var split_data=country_data.split('-');
                                        var dial_code=split_data[0];
                                        var country_name=split_data[1];
                                        country_dial_code+='<li data-value="'+dial_code+'"  data-fieldid="mobile_no">'+country_name+'  ('+dial_code+')</li>';
                                    });
                                    
                                    country_dial_code+='</ul>';
                                    country_dial_code+='</div></div>';
                                    country_dial_code+='<div class="form-group label-floating Mobile reg_mobile_div"   style="" >';
                                    country_dial_code+='<span class="help-block"></span>';
                                    country_dial_code+='</div></div></div>';
                                }
                                $.each(json['data']['column_mapping_list'], function(key, column_list) {
                                    
                                    var input_name=column_list['column_name']; //value['column_name'];
                                    var label_name=column_list['heading_name']; //value['heading_name'];
                                    var data_type=column_list['data_type']; //value['heading_name'];
                                    
                                    var value='';
                                    var disabled='';
                                    var date_class='';
                                    var read_only='';
                                    var hidden_field='';
                                    
                                    if(data_type=='date') {
                                        date_class=' datepicker_report';
                                        read_only='readonly="readonly"';
                                        totalDateField++;
                                    }
                                    
                                    //Incase of edit contact
                                    if(action=='edit_contact') {
                                        value=contact_data[input_name]; //Store value in this variable for input box
                                        
                                        if(input_name=='email' || input_name == 'mobile_no') { 
                                            if(value!='') {
                                                disabled='disabled';
                                                hidden_field='<input type="hidden" name="new_contact[hidden_'+input_name+']" id="hidden_'+input_name+'" value="'+value+'" />';
                                            }  
                                            var field = 'masked_'+input_name;
                                            value=contact_data[field];
                                        }
                                    }
                                    var dialCodeDropdown = '';
                                    var dialCodeStyle = '';
                                    var mobile_max_length = '';
                                    if(input_name == 'mobile_no') {
                                        dialCodeDropdown = country_dial_code;
                                        dialCodeStyle = ' style=\'width: 273px;\'';
                                        mobile_max_length = ' maxlength='+jsVars.maxMobileLength;
                                    }
                                    
                                    if(input_name !== 'dial_code') {
                                        
                                        var input_box=dialCodeDropdown + '<input type="text" '+mobile_max_length+' name="new_contact['+input_name+']" '+read_only+' id="'+input_name+'" value="'+value+'" class="form-control '+disabled+ date_class +'"  '+ disabled +' '+dialCodeStyle+' />'+hidden_field;
                                        html+='<div class="form-group formAreaCols"><div class="col-md-4"><label class="control-label" for="phone-number">'+label_name+'</label></div><div class="col-md-8">'+input_box+'<span id="'+input_name+'_error" class="show_err"></span></div></div>';
                                    }
                                });
                                
                            } else {
                                var label='';
                                if(action=='add_contact') {
                                    label='add contact into this list';
                                } else {
                                    label='edit this contact';
                                }
                                alertPopup('Label does not exist in this list. So you can\'t ' +label+'.', "error");
                                isThereAnyError=1;
                            }
                           $('#manage_contact_show_all_label').html(html);
                            
                           //Load Calendar if date field exist
                            if(totalDateField>0) {
                                $('.datepicker_report').datepicker({startView: 'month', format: 'yyyy-mm-dd', enableYearToMonth: true, enableMonthToDay: true});
                                LoadReportDatepicker();
                            }
                           break;
                        case 'add_tag':
                            tagIns = [];
                            $('#tag_id_val').val('');
                            //Set value in param    
                            $('#params').val(json['data']['college_id']);
                            var allId=[];
                            //Display All Tag
                            if(typeof json['data']['tag_list'] != 'undefined' && json['data']['tag_list']!='') {                                
                                $.each(json['data']['tag_list'], function(key, value) { 
                                    showTagOnDiv(value['id'],value['name']); 
                                    allId.push(value['id']);
                               });
                               
                               $("#tag_id_val").val(allId.join(','));
                            }
                            break;
                         case 'list_add_tag':
                            tagIns = [];
                            $('#tag_id_val').val('');
                            //Set value in param    
                            $('#params').val(json['data']['college_id']);
                            //Display All Tag
                            if(typeof json['data']['tag_list'] != 'undefined' && json['data']['tag_list']!='') {
                                var allId=[];
                                $.each(json['data']['tag_list'], function(key, value) { 
                                    showTagOnDiv(value['id'],value['name']); 
                                    allId.push(value['id']);
                               });
                               
                               $("#tag_id_val").val(allId.join(','));
                            }
                            break;
                    }
                }
                
                //if isThereAnyError variable value is 0 then display the popup
                if(isThereAnyError == 0) {
                    $('#showManageContactActionPopUp').trigger('click');
                }
           }
           
           
           //Display Error if there is any
           $('.show_err').html('');
           if(typeof json['error'] !='undefined'){
                for (var i in json['error']) {
                    var other_cls='';
                    if(i=='manage_contact_other_id') {
                        other_cls ='alert alert-danger';
                    }
                    $('#'+i+'_error').html(json['error'][i]).addClass('error ' + other_cls);
                }
            }
            
            //After successful Add/Update then display Success message
            if(typeof json['data_update'] !='undefined' && json['data_update']=='update'){
               $("#manage_contact_message_div").show();  
               
               //After update blank these fields value
               switch(action){
                   case 'change_lead_stage':
                       //$("#manage_contact_message_div").addClass("alert alert-success").html('Lead stage updated successfully.');
                       $('#lead_stage_id').val('').trigger('chosen:updated');
                       $("#stage_note").val("");
                        
                        $('#ShowChangeLeadStageBox').modal('hide');
                        alertPopup( json['message'], "success");
                        
                        //If page is segment contact list then load segment result
                        if(typeof $('#segment_id').val() !='undefined') {
                            LoadMoreSegmentContacts('reset');
                        } else if(typeof $('#list_id').val() !='undefined') { //else load Manage COntact result
                            LoadMoreContacts('reset');
                        }                       
                       break;
                    case 'add_contact':
                    case 'edit_contact':
                        $('#ShowChangeLeadStageBox').modal('hide');
                        alertPopup( json['message'], "success");
                        LoadMoreContacts('reset');
                        //setTimeout($('#ShowChangeLeadStageBox').modal('hide'),5000);
                       break;
                    case 'add_note':
                    case 'add_tag':
                        //$("#manage_contact_message_div").addClass("alert alert-success").html(json['message']);
                        $("#new_note").val("");
                        $('#tag_id_val').val('');
                        
                        $('#ShowChangeLeadStageBox').modal('hide');
                        alertPopup( json['message'], "success");
                        
                        //If page is segment contact list then load segment result
                        if(typeof $('#segment_id').val() !='undefined') {
                            LoadMoreSegmentContacts('reset');
                        } else if(typeof $('#list_id').val() !='undefined') { //else load Manage COntact result
                            LoadMoreContacts('reset');
                        }
                       break;
                    case 'list_add_tag':
                        tagIns = [];
                        //$("#manage_contact_message_div").addClass("alert alert-success").html(json['message']);
                        $("#new_note").val("");
                        $('#tag_id_val').val('');
                        
                        $('#ShowChangeLeadStageBox').modal('hide');
                        alertPopup( json['message'], "success");
                       break;
               }
            }
            
            
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       },
       complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
   });
}

function segmentBoxShowHide(elm){
    var selected = $(elm).val();
    var $el= $(elm).parents('.inner-criteria-container').find('.segment-value').parent();
    if($(elm).parents('.inner-criteria-container').find('.segment-value').length == 0){
        $(elm).parents('.inner-criteria-container').find('.segment-value-container select').next().show();
    }
    var html='';
    var load_date='';
    switch(selected){
        case 'blank':
        case 'not_blank': 
            if($(elm).parents('.inner-criteria-container').find('.segment-value').length > 0){
                $(elm).parents('.inner-criteria-container').find('.segment-value').hide().val('');
            }else{
                $(elm).parents('.inner-criteria-container').find('.segment-value-container select').next().hide();
            }
            break;
        case 'between':
            jQuery('.datepicker,.daterangepicker').remove();
            var selector = $(elm).parents('.inner-criteria-container').find('.segment-value');
            selector.addClass('daterangepicker_report').removeClass('datepicker_report').datepicker('remove').val('').show();
            load_date=1;
            break;
        case 'before':
        case 'after':
            jQuery('.datepicker,.daterangepicker').remove();
            var selector = $(elm).parents('.inner-criteria-container').find('.segment-value');
            selector.removeClass('daterangepicker_report').addClass('datepicker_report').off('hide.daterangepicker').val('').show();            
            load_date=1;
            break;
        default:
            $(elm).parents('.inner-criteria-container').find('.segment-value').show();
            break;
    }
    //if load_date (Means Date Filter) is 1 then load calendar
    if(load_date == 1) {
        LoadReportDatepicker();
        LoadReportDateRangepicker();
    }
}
    
     

/**
 * This function will use for all ajax request in Manage Contact Page
 * @param {integer} current_id (It may be college id/list id/segment id
 * @returns {undefined}
 */
function ajaxRequestInManageContact(current_id,selected_list_id,action){    
    var action_array=action.split(','); 
    $('#load_more_results_msg').html('');
    $("#LoadMoreArea").hide();
    $("#searchList").attr("disabled",false);
    if($.trim($('#s_college_id').val())==''){//Validation if college is not selected        
            var message='';
            var div_id='';
            var dropdown_label='';
            if($.inArray('get_list_name',action_array)>=0) {
                message='Please select an Institute name and list name and click search to view contacts.';
                div_id='list_id';
                dropdown_label='List Name';
            } else if($.inArray('get_segment_list',action_array)>=0) {
                message='Please select an Institute name and segment name and click search to view contacts.';
                div_id='segment_id';
                dropdown_label='Segment Name';
            }
        
            var $list_elem = $('#'+div_id);
            $list_elem.empty();
            $list_elem.append($("<option>"+dropdown_label+"</option>").attr("value", ""));
            $list_elem.trigger("chosen:updated");
            
            $('#load_more_results').html('');
            $('#if_record_exists, #summary_data').hide();
            $('#load_more_results').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center'>"+message+"</h4></div></div> </td></tr><tr></tr></tbody></table>");
            return false;
    }else if($.trim($('#s_college_id').val())>0 && //Validation if college is selected but list name/segment name is not selected
            ($.inArray('get_list_name',action_array)>=0 || $.inArray('get_segment_list',action_array)>=0)){
            
            var message='';
            var div_id='';
            var dropdown_label='';
            if($.inArray('get_list_name',action_array)>=0) {
                message='Please select list name and click search to view contacts.';
                div_id='list_id';
                dropdown_label='List Name';
            } else if($.inArray('get_segment_list',action_array)>=0) {
                message='Please select segment name and click search to view contacts.';
                div_id='segment_id';
                dropdown_label='Segment Name';
            }
        
            var $list_elem = $('#'+div_id);            
            $list_elem.empty();
            $list_elem.append($("<option>"+dropdown_label+"</option>").attr("value", ""));
            $list_elem.trigger("chosen:updated");
            
            
            if($list_elem.val()=='') {             
                $('#if_record_exists, #summary_data').hide();
                $('#load_more_results').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center'>"+message+"</h4></div></div> </td></tr><tr></tr></tbody></table>");                
            }
    }
    
       
    if($.inArray('get_lead_stage',action_array)>=0) {
        //Blank Lead Stage
        var $el = $('#lead_stage');
        $el.empty();
        $el.append($("<option>Lead Stage</option>").attr("value", ""));
        $el.trigger("chosen:updated");
    }
    
    if($.inArray('get_list_name',action_array)>=0 || $.inArray('get_segment_list',action_array)>=0) {
        
        //Blank List Name
        if($.inArray('get_list_name',action_array)>=0) {
            var $list_elem = $('#list_id');
            $list_elem.empty();
            $list_elem.append($("<option>List Name</option>").attr("value", ""));
            $list_elem.trigger("chosen:updated");
        } else if ($.inArray('get_segment_list',action_array)>=0) { //Incase of Segment List
            var $list_elem = $('#segment_id');
            $list_elem.empty();
            $list_elem.append($("<option>Segment List</option>").attr("value", ""));
            $list_elem.trigger("chosen:updated");
        }
        
        //Blank creator List
        var $imported_elem = $('#created_by');
        $imported_elem.empty();
        $imported_elem.append($("<option>Imported By</option>").attr("value", ""));
        $imported_elem.trigger("chosen:updated");
    }
    
    //For Imported By
    if($.inArray('get_creator_list',action_array)>=0) {
        var $imported_elem = $('#created_by');
        $imported_elem.empty();
        $imported_elem.append($("<option>Imported By</option>").attr("value", ""));
        $imported_elem.trigger("chosen:updated");
    }
    
    //For Advanced column and Filter
    if($.inArray('contact_column_list',action_array)>=0) {
        
        $('#load_more_results').html('');
        $('#if_record_exists, #summary_data').hide();
        
        if($('#segment_id').length>0) {
            $('#load_more_results').html("<table><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center'>Please click search to view contacts.</h4></div></div></td></tr><tr></tr></tbody></table>");            
        }else if($('#list_id').length>0) {
            $('#load_more_results').html("<table><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center'>Please click search to view contacts.</h4></div></div></td></tr><tr></tr></tbody></table>");            
        }

        $('div.more_criteria:not(:first)').remove();
        var $imported_elem = $('#field_name_0');
        $imported_elem.empty();
        $imported_elem.append($("<option>Labels</option>").attr("value", ""));
        $imported_elem.trigger("chosen:updated");
    }
    
    var data = $('#manageContacts').serializeArray();
    data.push({name: "action", value: action});        
    $.ajax({
        url: '/offline/ajaxAction',
        type: 'post',
        dataType: 'json',
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        data:data, 
        //async:false,
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        },
        success: function (json) {
            if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
               window.location.reload(true);
            }else if(typeof json['status'] != 'undefined' && json['status'] == 200){
                
                if(json['mobile_status']){
                        $('#mobile_status_filter').show();
                        $('.MobileStatus').show();
                    } else {
                        $('#mobile_status_filter').hide();
                        $('.MobileStatus').hide();
                    }
                //For List Name
                if($.inArray('get_list_name',action_array)>=0) {
                    getAllListnameByCollegeId(current_id,"list_id",selected_list_id);
                }
                
                //For Segment List
                if($.inArray('get_segment_list',action_array)>=0) {
                    $('#segment_id').html(json['segment_list_data']);
                    $('#segment_id').trigger("chosen:updated");
                }
                
                //For Lead Stage   
                if($.inArray('get_lead_stage',action_array)>=0) {
                    if(typeof json['lead_stage_data'] != 'undefined' && json['lead_stage_data'] !='') {
                        $.each(json['lead_stage_data'], function(key, value) {
                             $('#lead_stage').append($("<option></option>")
                                            .attr("value",key)
                                            .text(value));
                        });                     
                        $('#lead_stage').trigger("chosen:updated");
                    } 
                }
                
                //For Creator List
                if($.inArray('get_creator_list',action_array)>=0) {
                    if(typeof json['creator_list_data'] != 'undefined' && json['creator_list_data'] !='') {
                        $.each(json['creator_list_data'], function(key, value) {
                             $('#created_by').append($("<option></option>")
                                            .attr("value",key)
                                            .text(value));
                        });                      
                        $('#created_by').trigger("chosen:updated");
                    } 
                }
                
                
                //For Advanced View Column and Filter
                if($.inArray('contact_column_list',action_array)>=0) {
                    
                    if(typeof json['filter_option'] != 'undefined' && json['filter_option'] !='') {                        
                        $('#field_name_0').html(json['filter_option']);
                        $('#field_name_0').trigger("chosen:updated");
                    }
                    
                    if(typeof json['contact_column_list_data'] != 'undefined' && json['contact_column_list_data'] !='') {
                        //For Column
                        var ii=0;
                        var outer_counter=0;
                        var final_html='';
                             $.each(json['contact_column_list_data'], function(heading_key, value) {
                                ii++;
                                //console.log(value);
                                var active_cls='';
                                if(ii==1){ active_cls= 'class="active"'; }
                                final_html+="<li " + active_cls+"><a href='javascript:void(0)' id='column_create_keys_"+ ii +"' class=\"filterCollasp\">"; 
                                final_html+="<span class=\"glyphicon glyphicon-menu-down\"></span>";
                                final_html+="<span class=\"glyphicon glyphicon-menu-right\"></span>"+value['heading']+"</a>";
                                final_html+="<ul class=\"column_application filterCollaspData\">";
                                
                                if(typeof value['column'] !== 'undefined' && value['column'] !=='') {
                                    $.each(value['column'], function(li_key, li_value) {
                                            ii++;
                                            var checked = '';
                                            if(li_value['checked'] == 'checked'){
                                                checked = 'checked="checked"';
                                            }

                                            var displayNoneClass='';
                                            var hiddenTag='';
                                            var disabled='';
                                            if($.inArray(li_value['column_name'],json['default_key'])>=0) {
                                                displayNone = 'style="display:none "';
                                                hiddenTag= "<input style=\"display:none\" type=\"hidden\" name=\"column_create_keys[]\" value="+li_value['column_name']+" data-label_name="+li_value['column_name']+" class=\"column_create_keys\">";
                                                displayNoneClass=' btn disabled';
                                                disabled='disabled="disabled"';
                                            }
                                                final_html+="<li><label for=\"column_create_keys_"+ii+"\">";
                                                final_html+="<input "+checked+" type=\"checkbox\" id=\"column_create_keys_"+ii+"\" name=\"column_create_keys[]\" value="+li_value['column_name']+" data-input_id =\"\" data-label_name="+li_value['column_name']+" data-key_source=\"common\" class=\"column_create_keys "+displayNoneClass+"\"  " +disabled+">"+li_value['heading_name']+hiddenTag+"</label>";
                                                final_html+="</li>";
                                    });
                                }
                                final_html+="</ul></li>";                                              
                            }); 
                        //});  
                        //console.log(final_html);
                        $('#column_li_list').html(final_html);
                        
                        //Toggle
                        $('.filterCollasp').on('click', function(e) {
                            e.preventDefault();
                            $('.filterCollasp').parent().removeClass('active');
                            $(this).parent().addClass('active');
                        });
                        
                        //Close Filter column box when click on cancel button
                        jQuery(function(){
                             $('.filter_collapse').dropdown('toggle');
                         });
                    }
                }                
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

/**
 * This function will delete contact
 * @param {type} elem
 * @param {type} max_checkbox_checked
 * @param {type} type
 * @param {type} id
 * @returns {Boolean}
 */
function deleteContact(elem,max_checkbox_checked,type,id){
    if(type!='single' && isMultipleCheckboxChecked(elem,max_checkbox_checked)==false) {
        alertPopup('Select more than one list', 'error');
    } else {  
        collegeId=$('#s_college_id').val();
        if(typeof collegeId == 'undefined' || collegeId == "" ||  collegeId == 0) {
            alertPopup('Please select institute name.', 'error');
            return false;
        }
        var msg_type='';
        if(type=='single') { //If type is single then pass the list_id
            var all_ids=id;
            $('#select_all').val('');
        } else {
            var all_ids=getAllCheckedValue('selected_users[]');
            msg_type='s';
        }
        
        var data = $('#manageContacts').serializeArray();
        data.push({name: "contact_id", value: all_ids});
        data.push({name: "action", value: 'delete_contact'});
        data.push({name: "saveType", value: 'delete'});
        $("#confirmYes").removeAttr('onclick');
        $('#confirmTitle').html("Confirm Delete action");
        $("#confirmYes").html('Ok');
        $("#confirmYes").siblings('button').html('Cancel');
        
        $('#ConfirmMsgBody').html('Are you sure you want to delete selected contact'+msg_type+'?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                e.preventDefault();
                $.ajax({
                    url: '/offline/manageContactAction',
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    beforeSend: function () {
                        $('div.loader-block').show();
                    },
                    complete: function () {
                        $('div.loader-block').hide();
                    },
                    success: function (json) {
                        if (typeof json['session_error'] !='undefined' && json['session_error'] =='session_logout') {
                            alertPopup('Your session is exired. Please login again!', 'error','/offline/manage-list-contacts');
                        } else if (typeof json['error'] !='undefined' && json['error'] !='') {
                            alertPopup(json['error'], 'error');
                        } else if (typeof json['status'] !='undefined' && json['status'] == 200) {                            
                            alertPopup( json['message'], "success");
                            
                            //If page is segment contact list then load segment result
                            if(typeof $('#segment_id').val() !='undefined') {
                                LoadMoreSegmentContacts('reset');
                            } else if(typeof $('#list_id').val() !='undefined') { //else load Manage COntact result
                                LoadMoreContacts('reset');
                            }
                            
                        }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
                    }
                });
                $('#ConfirmPopupArea').modal('hide');
            });
        return false;
    }
}

function createSegmentActionListManager(elem,max_checkbox_checked){
    //Check how many records are there as per filter so if only 1 record found then bulk action should work
    var total_result=0;
    if($('#all_records_val').length>0) {
        total_result = $('#all_records_val').val();
    }
        
    if(isMultipleCheckboxChecked(elem,max_checkbox_checked)==false){
        alertPopup('Select more than one list', 'error');
    }else{
        var data = $('#listManager').serializeArray();
        $.ajax({
                    url: '/offline/createSegmentUrl',
                    type: 'post',
                    data: data,
                    dataType: 'json',
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    success: function (json) {
                        if (json == "session_logout") {
                            alertPopup('Your session is exired. Please login again!', 'error','/offline/list-manager');
                        } else if (typeof json['error'] !='undefined' && json['error'] !='') {
                            alertPopup(json['error'], 'error');
                        } else if (typeof json['status'] !='undefined' && json['status'] == 200) {
                            window.open(json['url']);
                        }
                        return false;
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                        
                    }
                }); 
    }
    
}

function Removerow(elem){
    //Check if any div exist with these class
    var total_row=$('div.more_criteria >.first_column').length;
    if(total_row==1){
        var div_id=$(elem).parent('div').parent('div').attr('id');
        $('#'+div_id).attr('id','adv_filter_row_1');
        $('#condition_field_0').val('');
        
        //Empty first Column
        $('#field_name_0').val('');
        $('#field_name_0').trigger("chosen:updated");
        
        //Empty Second Column
        $('#condition_field_0').empty();
        $('#condition_field_0').trigger("chosen:updated");
        
        $('div.third_column > div').empty(); //Empty third column
        $('#filter_criteria').hide();
        $('#advanced_filter').hide();
        $('input[name=search_criteria]').attr('checked',false);
    }
    
    if(total_row >1) {
        if(typeof $(elem).parent('div').parent('div').parent('div').attr('id') !='undefined') {
            var div_id=$(elem).parent('div').parent('div').attr('id');
            $('#'+div_id).remove();
        }
    }
}

/**
 * This function is use for Manage Segment Contacts Section
 * @param {string} type
 * @returns {Boolean}
 */
function LoadMoreSegmentContacts(type) {
    
    if (type == 'reset') {
        if($('#s_college_id').val()=='') {
            $('#load_more_results').html('');
            $('#if_record_exists, #summary_data').hide();
            //$('#load_more_results_msg').html('');
            $('#load_more_results').html("<table><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center'>Please select an Institute name and segment name and click search to view contacts.</h4></div></div></td></tr><tr></tr></tbody></table>");            
            return false;
        } else if($('#s_college_id').val() >0 && $('#segment_id').val()=='' || $('#segment_id').val()==null){
            $('#load_more_results').html('');
            $('#if_record_exists, #summary_data').hide();
            //$('#load_more_results_msg').html('');
            $('#load_more_results').html("<table><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center'>Please select Segment name and click search to view contacts.</h4></div></div></td></tr><tr></tr></tbody></table>");            
            return false;
        }
        
        Page = 0;
        $('#load_more_results').html("");
        $('#load_more_results_msg').html("");
        $('#load_more_results_msg, #summary_data').show("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('button[name="search_btn"]').attr('disabled','disabled');
        
        $('#tag_id_val').val('');
        
        //Load Summary section
        getManageContactsSummaryData('manage_segmant_contact_summary');
    }
    var data = $('#manageContacts').serializeArray();
    data.push({name: "page", value: Page});
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/offline/ajax-manage-segment-contacts',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function (xhr) {
            $('#listloader').show();
        },
        success: function (data) {
            $('button[name="search_btn"]').removeAttr('disabled');
            Page = Page + 1;
            if (data == "session_logout") {
                window.location.reload(true);
            }
            else if (data == "error") {
                if(Page==1)error_html="No Records found";
                else error_html="No More Record";
                $('#load_more_results_msg').html("<table class='table table-striped list_data'><tbody><tr><td><div class='row'><div class='col-md-12'><h4 class='text-center text-danger'>"+error_html+"</h4></div></div> </td></tr><tr></tr></tbody></table>");
                $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Contacts");
                $('#load_more_button').hide();
                  if (type != '' && Page==1) {
                        $('#if_record_exists').hide();
                  }
            }else {
                
                if (type == 'reset') {
                    $('#load_more_results').html("");
                }
                data = data.replace("<head/>", '');
                
                if(Page==1) {
                    $('#load_more_results').append(data);
                    if(typeof jsVars.itemPerPage !='undefined' && $('#all_records_val').val() >= jsVars.itemPerPage
                    ){
                        $('#LoadMoreArea').show();
                        $('#load_more_button').show();                        
                    }
                } else {
                    $('#load_more_results > tbody > tr:last').after(data);
                }
                
                $('#load_more_button').removeAttr("disabled");
                
                if(typeof jsVars.itemPerPage !='undefined' &&
                   $('#all_records_val').val() >= jsVars.itemPerPage
                  ){
                    $('#load_more_button').html("<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp;&nbsp;Load More Contacts");
                    $('#load_more_button').removeAttr("disabled");
                    
                    // if select all then all checkbox is selected
                    if($('#select_all:checked').length>0) {
                        selectAllCheckbox(document.getElementById('select_all'));
                    }
                    
                  } else {
                      $('#load_more_button').hide();
                  }                
                if (type != '') {
                    $('#if_record_exists').fadeIn();
                }
                dropdownMenuPlacement()
//                $.material.init();
                table_fix_rowcol();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        },
        complete: function (jqXHR, textStatus) {
            $('#listloader').hide();
        }
    });
}

/**
 * This function will use in View Reports Section
 * @param {type} college_id
 * @returns {Boolean}
 */
function showListNameInViewReports(college_id){
    if(college_id=='') {
        //Blank all values of List Dropdown
        var $list_elem = $('#list_id');
        $list_elem.empty();
        $list_elem.append($("<option>List Name</option>").attr("value", ""));
        $list_elem.trigger("chosen:updated");
        
        //Blank all values of Created By Dropdown
        var $list_elem = $('#created_by');
        $list_elem.empty();
        $list_elem.append($("<option>Imported By</option>").attr("value", ""));
        $list_elem.trigger("chosen:updated");
        
        $('#load_more_results_msg').html('');
        
        $('#load_more_results').html('');
        $('#if_record_exists, #table-data-view, #LoadMoreArea').hide();
		$('#load_msg_div').show();
        //$('#load_more_results').html("<table><tbody><tr><td><h4 class='text-center'>Please select an Institute to view reports.</h4></td></tr><tr></tr></tbody></table>");            
        return false;
    }
    $('#if_record_exists').hide();
	$('#if_record_exists, #table-data-view, #LoadMoreArea').hide();
	$('#load_msg_div').show();
    //$('#load_more_results').html("<table><tbody><tr><td><h4 class='text-center'>Please click on search button to view reports.</h4></td></tr><tr></tr></tbody></table>");            
    getAllListnameByCollegeId(college_id,"list_id","");
    getLeadUploadedUsers(college_id,"created_by");
}

/**
 * This function will display contact data from MongoDB
 * @param {type} upload_id
 * @param {type} contact_type
 * @returns {undefined}
 */  //show_contact_data
function showInvalidDataPopUp2(upload_id,contact_type){
        try {    
            $("#add_edit_list").hide();//hide message
            //create list case
            if(typeof type !='undefined' && type ==''){
              $('#name').val('');
              $('#description').val(''); 
            }
            var postData='';
            var loadPopup=0;
            if(typeof type !='undefined' && (type=='edit' || type=='add')){ //This will 
                $('.show_err').html('');
                $('#other_id_error').removeClass('error alert alert-danger');
                var postData = $('#addListForm').serialize();
            } else { //When display the popup
                /*
                if($('#s_college_id').val()<=0) {
                    alertPopup('Please select college.', 'error');
                    return false;
                } */

                jQuery('#showAddToListContainer').html('loading...');
                //postData={data:data};
                var postData = $('#listManager').serialize();

                if(typeof list_id !='undefined' && list_id>0) {
                    postData+="&list_id=" + list_id;
                }

                loadPopup=1;

                $("#add_edit_list").removeClass("alert alert-success");
                $("#add_edit_list").html("");
                $('h2.modal-title').html('Failed Contact'); //Bydefault Set Popup Title

            }

            var data = $('#manageContacts').serializeArray();
            data.push({name: "contact_type", value: contact_type});
            data.push({name: "upload_id", value: upload_id});
            $.ajax({
               url: '/offline/show-contact-data',
               type: 'post',
               dataType: 'json',
               data: data,
               headers: {
                   "X-CSRF-Token": jsVars._csrfToken
               },
               success: function (json) {
                   if((typeof json['session_error'] !='undefined' && json['session_error']=='session_logout') || 
                      (typeof json['token_error'] !='undefined' && json['token_error']=='token_error')){
                       window.location.reload(true);
                   }

                   if(loadPopup==1) {
                       if(json['data'] != '') {

                            /*
                            var $el = $('#college_id');
                            $el.empty();
                            $el.html(json['data']['college_list']);



                           $el.trigger("chosen:updated");

                           $("#college_id").val(json['data']['college_id']).trigger("chosen:updated");

                           //In case of Edit case
                           var edit_form_id='';
                           if(typeof json['data']['list_id'] !='undefined' && $.trim(json['data']['list_id'])>0) {
                                $('#saveType').val('edit');
                                $('#list_id').val(json['data']['list_id']);
                                $('#name').val(json['data']['name']);
                                $('#description').val(json['data']['description']);
                                edit_form_id=json['data']['form_id'];
                                $('h2.modal-title').html('Edit List');
                            }

                            //Load Forms as per college Id
                            OfflineLoadForms(json['data']['college_id'], edit_form_id,'div_list_load_forms',"multiselect");
                            */
                            //Set Form select box width
                            $('ul.chosen-choices > li >input').css('width','150px');
                        }
                        $('#showCreateListPopUp').trigger('click');

                        //1170px
                        //$('#manage_contact_modal_width_id').css("width","1000px");
                   }


                   //Display Error
                   $('.show_err').html('');
                   if(typeof json['error'] !='undefined'){
                        for (var i in json['error']) {
                            var extra_class='';
                            if(i == 'other_id') {
                                extra_class='alert alert-danger';
                            }
                            $('#'+i+'_error').html(json['error'][i]).addClass('error ' + extra_class);
                        }
                    }

                     if(typeof json['data_update'] !='undefined' && json['data_update']=='update'){
                         //$('#ConfirmPopupArea').modal('hide');
                        $("#add_edit_list").show();

                        var msgType='';
                        if($('#saveType').val()=='edit') {
                            msgType='List successfully updated.';
                        } else if ($('#saveType').val()=='add') {
                            msgType='New List successfully created.';
                            //After successful update blank these dropdown value
                            $('#college_id').val('').trigger('chosen:updated');

                            $('#div_list_load_forms > #form_id').empty();
                            $('#div_list_load_forms > #form_id').val('').trigger("chosen:updated");

                            $('#name').val("");
                            $('#description').val("");
                        }
                        $("#add_edit_list").addClass("alert alert-success").html(msgType);

                        //Call this function so it will load the result
                        LoadMoreOfflineLeads('reset');
                     }
               },
               error: function (xhr, ajaxOptions, thrownError) {
                   console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
               }
           });

       }catch(err) {

       }
   }
   
    function showInvalidDataPopUp(data){
         
        $.ajax({
            url: '/offline/show-contact-data',
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
    
    function exportLeadErrorLogCsv(data){
        var $form = $("#errorLogForm");
        $form.attr("action",'/offline/export_lead_error_log_csv');
        $form.attr("target",'modalIframe');
        $("#errorLogForm #filterData").val(data);
        var onsubmit_attr = $form.attr("onsubmit");
        $form.removeAttr("onsubmit");
        $('#myModal').modal('show');
        $form.submit();
        $form.attr("onsubmit",onsubmit_attr);
        $form.removeAttr("target");
    }
    /*
     * count list records by list id and college collection
     */
    function countRecordsByListIdMongo(){
         data = $('#segmentManager').serialize();
          
        $.ajax({
            url: '/offline/countRecordsByListIdMongo',
            type: 'post',
            dataType: 'json',
            data: data,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#refresh-icon').addClass('fa-spin');
            },
            success: function (json) {
                if(json=='session_logout'){
                    window.location.reload(true);
                }else if(typeof json['error'] !='undefined' && json['error'] !=''){
                   alertPopup(json['error'], 'error');
                }else if(typeof json['status'] !='undefined' && json['status'] == 200){
                    $("#total_records").html('List Lead Count: &nbsp;&nbsp;'+json['total_records']);
                    $('#refresh-icon').removeClass('fa-spin');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    /*
     * count list records by list id and college collection
     * with Segment Criteria
     */
    function countSegmentViewFromMongo(){
         data = $('#segmentManager').serialize();
          
        $.ajax({
            url: '/offline/countSegmentViewFromMongo',
            type: 'post',
            dataType: 'json',
            data: data,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function (xhr) {
                $('#listloader').show();
            },
            success: function (json) {
                if(json=='session_logout'){
                    window.location.reload(true);
                }else if(typeof json['error'] !='undefined' && json['error'] !=''){
                   alertPopup(json['error'], 'error');
                }else if(typeof json['status'] !='undefined' && json['status'] == 200){
                    $("#div_view_count").show();
                    $("#div_view_count").html('<span id="view_count" class="view_count">'+json['total_records']+'</span>');
                }
            },
            complete: function (jqXHR, textStatus) {
                $('#listloader').hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
    
    /*
     * check batch process
     */
    function checkBatchProcess(elem,max_checkbox_checked,formIdName,url){
        //Check how many records are there as per filter so if only 1 record found then bulk action should work
        var total_result=0;
        if($('#all_records_val').length>0) {
            total_result = $('#all_records_val').val();
        }
//        alert(total_result);
//        alert(isMultipleCheckboxChecked(elem,max_checkbox_checked));
        
        if(isMultipleCheckboxChecked(elem,max_checkbox_checked)==false){
            var msg='';
            switch(formIdName){
                case 'listManager':
                        msg='Select more than one list';
                    break;
                case 'manageContacts':
                        msg='Select more than one user';
                    break;
                case 'segmentManager':
                        msg='Select more than one segment';
                    break;
            }
            alertPopup(msg, 'error');
        }else{
            $('#myModal').modal("show");
                var $form = $("#"+formIdName);
                 $form.attr("action",url);
                 $form.attr("target",'modalIframe');
                 $form.append($("<input>").attr({"value":"export", "name":"export",'type':"hidden","id":"export"}));
                 var onsubmit_attr = $form.attr("onsubmit");
                 $form.removeAttr("onsubmit");
                 $form.submit();
                 $form.attr("onsubmit",onsubmit_attr);
                 $form.removeAttr("target");
                 $form.find('input[name="export"]').remove();
                 //Remove Export hidden value to blank so searching will work again
                 $('#export').val('');
                $('#myModal').on('hidden.bs.modal', function(){
                      $("#modalIframe").html("");
                      $("#modalIframe").attr("src", "");
                });
        }
        
    }
    
function getDependentConditionField(name, className, placeholder){
    var el = '<div class="input text"><div class="form-group"><input type="text" value="" placeholder="'+placeholder+'" class="'+className+'" name="'+name+'"></div></div>';
    return el;
}

//determineDropDirection();
//$(window).scroll(determineDropDirection);

var downloadErrorReportFile = function(url){
    window.open(url, "_self");
};


function validateSegment(){
    
    $('.segment-list-error, .segment-name-error').remove();
    var emptyVal = true;
    if($('#segment-list').val() == null || $('#segment-list').val() == '') {
        $('#segment-list').parent().after('<span class="segment-list-error error">Please choose List name</span>');
        emptyVal = false;
    }

    if($('#s_college_id').val() == null || $('#s_college_id').val() == '') {
        $('#s_college_id').parent().after('<span class="segment-list-error error">Please choose college</span>');
        emptyVal = false;
    }
    if($('#segment_name').val() == null || $('#segment_name').val() == ''){
        $('#segment_name').after('<span class="segment-name-error error">Please choose segment name</span>');
        emptyVal = false;
    }

    //For Search for contact that match Validation
    $('.outer-group-container').each(function(){
        var crieteria=$(this).find('.segment-criteria').attr('name');             
        if($('input[name="'+crieteria+'"]:checked').length === 0){
            emptyVal = false; 
            $(this).find('.segment-criteria-condition').after('<span class="padding-left-10 segment-list-error error">Please select criteria</span>');
        }            
    });

    //For Inner dropdown validation
    $('.inner-criteria-container').each(function(){
        var crieteria=$(this).find('.segment-lable').attr('name');
        if($('select[name="'+crieteria+'"]').val() == ''){    
            emptyVal = false;
            $(this).find('div:first > div > div.chosen-drop').parent().after('<span class="padding-left-10 segment-list-error error">Please select label</span>');
        }

        var condition=$(this).find('.segment-condition').attr('name');
        if($('select[name="'+condition+'"]').val() == ''){    
            emptyVal = false;
            $(this).find('div:nth-child(2) > div > div.chosen-drop').parent().after('<span class="padding-left-10 segment-list-error error">Please select condition</span>');
        }
    });

    return emptyVal;
}

/**
 * This function will check whether their is any communication is in progress of selected list and college id
 * If status is completed or not create any communication yet then it can allow for add new contact
 * @param {type} college_id
 * @param {type} list_id
 * @param {type} isModal
 * @returns {Boolean}
 */
function isCommunicationInProgress(college_id,list_id,isModal) { 
    var error='';
    if(college_id==''){
        error+="Please select college id. \n";
    }
    if(list_id==''){
        error+="Please select list id. \n";
    }
    
    if(error !=='' ){
        alertPopup(error, 'error'); 
        return false;
    }
    
    $.ajax({
        url: '/offline/is-communication-in-progress',
        type: 'post',
        dataType: 'json',
        data: {
            college_id: college_id,
            list_id: list_id
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:false,
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            
            if(typeof data['error'] !== 'undefined') {
              alertPopup(data['error'], 'error');  
            } else if(typeof data['total_records'] !== 'undefined') {
                if(data['total_records']>0) {
                    alertPopup('You can\'t import new contact in this list. Because communication is In Process', 'error');  
                } else {
                    if(typeof isModal !== 'undefined' && isModal == true) {
                        manageContactAction("add_contact",'');
                    } else {
                        window.open(data['redirect_url'], '_blank');
                    }
                }              
            }
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

//Reset Create Offline List Form
function ResetCreateOfflineListForm() {
    $('form#addListForm input, form#addListForm textarea').val('');
    $('form#addListForm select').val('').trigger('chosen:updated');
}

/**
 * For reset the form
 * @param {type} form_name (Pass the form id
 * @returns {undefined}
 */
function ResetOfflineFilter(form_name){
    $('form#'+form_name+' input[type=text], form#'+form_name+' textarea').val('');
    $('form#'+form_name+' select').val('').trigger('chosen:updated');  
    if('listManager' == form_name){
        jQuery('#tot_records, #load_more_results').html('');
		jQuery('#load_msg_div').show();
		jQuery('#table-data-view, #if_record_exists, #LoadMoreArea').hide();
    }else if('segmentManager' == form_name){
        jQuery('#tot_records, #load_more_results').html('');
		jQuery('#load_msg_div').show();
		jQuery('#table-data-view, #if_record_exists, #LoadMoreArea').hide();
    }else if('manageContacts' == form_name){
        jQuery('#tot_records, #load_more_results').html('');
		jQuery('#load_msg_div').show();
		jQuery('#table-data-view, #if_record_exists, #LoadMoreArea').hide();
    }
    return false;
}


//For Dropdown Menu Country Dial Code
$(document).ready(function(e){
    $( document ).on( 'click', '.bs-dropdown-to-select-group .dropdown-menu-list li', function( event ) {
    	var $target = $( event.currentTarget );
                var fieldId = $(this).data("fieldid");
		$target.closest('.bs-dropdown-to-select-group')
			.find('[data-bind="bs-drp-sel-value"]').val($target.attr('data-value'))
			.end()
			.children('.dropdown-toggle').dropdown('toggle');
		$target.closest('.bs-dropdown-to-select-group')
                //.find('[data-bind="bs-drp-sel-label"]').text($target.context.textContent);
    		.find('[data-bind="bs-drp-sel-label"]').text($target.attr('data-value'));
                
                //When Select the option from dropdown then close the open dropdown
              $target.closest('.bs-dropdown-to-select-group').removeClass('open');
                
                //Bydefault remove the value when value will change
                $('#'+fieldId).val('');
                
                //For change Maxlength value of Mobile Input Box as per selection of country code
                if ($target.attr('data-value') == jsVars.defaultCountryCode) {
                    $('#'+fieldId).attr('maxlength',jsVars.maxMobileLength);
                } else {
                    $('#'+fieldId).attr('maxlength',jsVars.internationalMaxMobileLength);
                }
		return false;
	});
        jQuery('.filter_dial_code').on('click', function (e) {
                  e.stopPropagation();
               });
});

// this function is used when there is mobile dial country code is selected in form applicant
function filterDialCode() 
{
    
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

function rePushToRabbit(upload_id) { 
    $('#requeue_'+upload_id).html("Sending...")
    $.ajax({
        url: '/offline/rePushToRabbit',
        type: 'post',
        dataType: 'html',
        data: {
            upload_id: upload_id
        },
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }else if(data=="success") {
               $('#requeue_'+upload_id).html("Sent");
            }else if(data=="error") {
               $('#requeue_'+upload_id).html("Error");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}
function modalFix(){
	$('.filter_btn .btn').click(function() {
	  $('#content').toggleClass('layerUnset');
	});
	$('#filter').on('show.bs.modal', function () {
	  $('#content').addClass('layerUnset');
	});
	$('#filter').on('hidden.bs.modal', function () {
	  $('#content').removeClass('layerUnset');
	});
}

function manageSegmentAccess(segmentId,module = ''){
    var collegeId = $('#s_college_id').val();
    if(typeof collegeId =='undefined' || collegeId ==''){
        return false;
    }
    if(typeof segmentId !='undefined' && segmentId!=''){
        $.ajax({
            url: '/offline/manageSegmentAccess',
            data: {segmentId: segmentId,collegeId:collegeId,module:module},
            dataType: "html",
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
            success: function (data) {
                if (data === 'session_logout'){
                    location = jsVars.FULL_URL;
                }
                data = data.replace("<head/>", '');
                $('#ActivityLogPopupArea .modal-title').html('Edit Segment Access');
                $('#ActivityLogPopupHTMLSection').html(data);
                $('#ActivityLogPopupArea').modal({backdrop: 'static', keyboard: false});
                //$('#ActivityLogPopupArea .modal-header').css('background-color', '#a0c348');
                $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
                //$('#ActivityLogPopupArea .modal-dialog').css('width', '600px');
                if($('.checkboxSumoJS').length){
                    $('.checkboxSumoJS').SumoSelect({placeholder:'Select Value',okCancelInMulti :true, search: true, searchText:'Search Value', selectAll : true,csvDispCount:0, captionFormatAllSelected: "All Selected.", triggerChangeCombined: false,showTitle : false }); 
                    $('.checkboxSumoJS')[0].sumo.reload();
                }
                sumoSelectOpen();
				floatableLabel();
            },
            error: function (response) {
                alertPopup(response.responseText,'error');
            },
            failure: function (response) {
                alertPopup(response.responseText,'error');
            }
        });
    }else{
        alertPopup('Id not found','error');
    }
}

/**
 * This function use for updation of segment Access
 * @return
 */
function updateSegmentAccess(){
    var isEdit = 0;
    if($('#college_staff').length >= 1 && $('#college_staff').val() != null){
        $.each($('#college_staff').val(),function(index,value){
            if(value.indexOf('_2') > -1){
                isEdit = 1;
            }
        });
    }
    if($('#college_counsellor').length >= 1 && $('#college_counsellor').val() != null){
        $.each($('#college_counsellor').val(),function(index,value){
            if(value.indexOf('_2') > -1){
                isEdit = 1;
            }
        });
    }
    if(isEdit){
        $("#ConfirmPopupArea").css({'z-index':'120000'});
        $('#ConfirmMsgBody').html('Every user with Edit Access can edit the Segment logic');
        $('#confirmYes').css('margin', '10px');
        $('#ConfirmPopupArea').modal({ backdrop: 'static', keyboard: false })
            .one('click', '#confirmYes', function (e) {
                var postData = $('#segmentAccessManager').serializeArray();
                segmentAccessManager(postData);
                $('#ConfirmPopupArea').modal('hide');
        });
    } else {
        var postData = $('#segmentAccessManager').serializeArray();
        segmentAccessManager(postData);
    }
}

function segmentAccessManager(postData){
    
    $.ajax({
        url: '/offline/update-segment-access',
        type: 'post',
        dataType: 'json',
        data: postData,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        async:false,
        success: function (json) {
                if(typeof json['session_error'] !='undefined' && json['session_error']=='session_logout'){
                   window.location.reload(true);
                }else if(typeof json['error'] !='undefined' && json['error']!=''){
                   alertPopup(json['error'], 'error');
                }else{
                    alertPopup(json['message']);
                    $('#ActivityLogPopupArea').modal('hide');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
}
    
function sumoSelectOpen(){
    $('select.checkboxSumoJS').on('sumo:opened', function(sumo) {
    $('.optionGroup').parent().parent().siblings().addClass('optionGroupChild ogGroupChild');
    $('.optionGroup').parent().parent().removeClass('optionGroupChild ogGroupChild');
    $("i.optionLastChild").each(function(){
        $(this).parent().parent().addClass('optionGroupChild2');
    });
    $('.opt label').removeAttr('title');
    });
}

$('html').on('click','.opt:not(.optionGroupChild)',function(){
    if($(this).hasClass('selected')){
        $(this).next('.optionGroupChild:not(.selected)').first().trigger('click');
    } else {
        $(this).next('.optionGroupChild.selected').first().trigger('click');
        $(this).next('.optionGroupChild').first().next('.optionGroupChild.selected').trigger('click');
    }
});
