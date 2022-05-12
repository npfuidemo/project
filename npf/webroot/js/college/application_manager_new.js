
// on change of colleges/institute
$(document).on('change','#FilterApplicationForm select#Institute', function(){
    var CollegeId;
    CollegeId = this.value;
    var Condition = 'only_enable_form';
    GetAllRelatedForms(CollegeId,Condition);
    UpdateStateList(CollegeId,'','');
    UpdateCreatedByList(CollegeId,'','');
    //$("#CreatedBySelect").trigger("chosen:updated");
    $('.advance-filter-block').addClass('display-none');
});

//on change of forms
$(document).on('change','#FilterApplicationForm select#InstituteForms', function (){
    CollegeId=$("select#Institute").val();
    FormId = this.value;
    UpdateStateList(CollegeId,FormId,'');
    //UpdateCreatedByList(CollegeId,FormId,'');
    GetFormRelatedFieldsUrl(FormId);        
});


//Advanced Filter Add More Button
$(document).on('click','#AddMoreSearchButton', function(){
    $('#SelectBoxArea').append(jsVars.FormSelectFields);
    $('.chosen-select').chosen();
});

$(document).on('change','#SelectArea select.chosen-select', function (){
    if(this.value){
        var $Key = this.value;
        var KeyArray = $Key.split("||"); 
        var Colomn = KeyArray[0];
        var PreSelect = '';
        if(typeof jsVars.AdvancedSearch != 'undefined'){
            var valueFields =  jsVars.AdvancedSearch.value;   
            
            if(Colomn in valueFields){
                PreSelect = valueFields[Colomn];
            }            
        }
        
        var Html = GenrateHtmlField(KeyArray,this,PreSelect);
        var TopParent = $(this).parents('div#SelectArea').parent();
        if($(TopParent).find('div#ValueArea').length > 0){
            $(TopParent).find('div#ValueArea').remove();
        }
        if(KeyArray[1] != 'machine_key'){
            $(TopParent).append(Html);
            $('.chosen-select').chosen();
            $('.datepicker').datepicker({startView : 'month', format : 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay : true});
        }
        $('.chosen-select').trigger('chosen:updated');
    }  
    else{
        var TopParent = $(this).parents('div#SelectArea').parent();
        if($(TopParent).find('div#ValueArea').length > 0){
            $(TopParent).find('div#ValueArea').remove();
        }
    }
});

function LoadDateTimePickerFilter(){
    $('.datetimepicker').datetimepicker({format: 'DD/MM/YYYY HH:mm',viewMode: 'years'});
}

function onlinePaymentDetails(ApplicationId,form_id){
    if(ApplicationId){ 
        callAjaxRequest(ApplicationId,'onlinePaymentDetails',form_id);        
    }
}

function offlinePaymentDetails(ApplicationId,form_id){
    if(ApplicationId){ 
        callAjaxRequest(ApplicationId,'offlinePaymentDetails',form_id);        
    }
}

function demandDraftDetails(ApplicationId,form_id){
    if(ApplicationId) {
        callAjaxRequest(ApplicationId,'demandDraftDetails',form_id);
    }
}

function voucherDetails(ApplicationId,form_id){
    if(ApplicationId){
        callAjaxRequest(ApplicationId,'voucherDetails',form_id);
    }
}

function UpdateDemandDraftDetails(ApplicationId,form_id){
    if(ApplicationId){
        if(!$('#DDRecieved:checked')){
            $('#DDRecieved').css('border','1px solid red');
        }
        if($('#DDRecievedDate').val() == ''){
            $('#DDRecievedDate').css('border','1px solid red');
        }
        else if($('#DDRecieved:checked') && ($('#DDRecievedDate').val() != '')){
            var DDRecievedDate = $('#DDRecievedDate').val();
            $.ajax({
                url: jsVars.SaveGetApplicationInfoUrl,
                type: 'post',
                data: {id:ApplicationId,area:'UpdateDemandDraftDetails',DDRecievedDate:DDRecievedDate,form_id:form_id},
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
                success: function (json){
                    if(json['redirect']){
                        location = json['redirect'];
                    }else if(json['error']){
                        alertPopup(json['error'],'error');
                    }else if(json['success'] == 200){
                        $('span#ApplicationPaymentStatusSpan'+ApplicationId).removeClass('payment-not-recieve-message');
                        $('span#ApplicationPaymentStatusSpan'+ApplicationId).addClass('payment-recieve-message');
                        $('span#ApplicationPaymentStatusSpan'+ApplicationId).text(jsVars.StatusList['5']);
                        $('.npf-close').trigger('click');
                        alertPopup(json['msg']);
                    }    
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    $('div.loader-block').hide();
                }
            });
        }    
    }
}

function remarkDetails(ApplicationId){
    if(ApplicationId){
        alertPopup('Getting error to open popup.');
    }
}

function documentDetails(ApplicationId,formId,app_num,stu_name){
    if(ApplicationId){
        $.ajax({
            url: jsVars.manageDocumentsInfoUrl,
            type: 'post',
            data: {id:ApplicationId,form_id:formId},
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
            success: function (json){
             //$('#result').html(json);
                
                if(json['redirect']){
                    location = json['redirect'];
                }else if(json['error']){
                        $("#stu_name_e").html(stu_name);
                        $("#app_num_e").html(app_num);
                         $('#errorText').html(json['error']);
                         $("#document-error").modal();
                }
                else if(json['success'] == 200){
                   // console.log(json['data']);
                   $("#stu_name").html(stu_name);
                   $("#app_num").html(app_num);

                   var htmlData = '';
                   var srno = 1;
                   var admitcardlink='';
                   
                   if(typeof json['download_admit_card']!='undefined' && json['download_admit_card']==1){
                       if(json['admitcard']){
                           admitcardlink+='<tr>';
                           admitcardlink+='<td>'+srno+'.</td>';
                           admitcardlink+='<td><label class="docdetlabel">Admit Card</label></td>';
                           admitcardlink+='<td class="text-center"><label class="docdetlabel"><a class="btn btn-default btn-doc" href="'+json['admitcard']+'" target="_blank">Print</a></label></td>';
                           admitcardlink+='</tr>';
                           srno++;
                        }
                    }
                   
                   if(json['ackcard']){
                       admitcardlink+='<tr>';
                       admitcardlink+='<td>'+srno+'.</td>';
                       admitcardlink+='<td><label class="docdetlabel">Acknowledgement Card</label></td>';
                       admitcardlink+='<td class="text-center"><label class="docdetlabel"><a class="btn btn-default btn-doc" href="'+json['ackcard']+'" target="_blank">Print</a></label></td>';
                       admitcardlink+='</tr>';
                   }
                   
                   if(json['data']){  
                        for(var doc_data in json['data']){
                            srno++;

                                htmlData+='<tr>';

                                 htmlData+='<td> '+srno+' </td>';
                                 htmlData+='<td>';
                                 htmlData+='<label class="docdetlabel">'+json['data'][doc_data].name+'</label>';
                                 htmlData+='</td><td class="text-center"><label class="docdetlabel">';
                                 if(json['data'][doc_data].path=='' || typeof json['data'][doc_data].path =='undefined'){
                                     htmlData+=' Document Not Uploaded';
                                 }else{
                                     htmlData+='<a href="'+json['data'][doc_data].path+'" class="btn btn-default btn-doc">Download</a>';
                                 }
                                 htmlData+='</label></td></tr>';
                        }
                    }
//                    admitcardlink = '';
//                    htmlData = '';
                    if(htmlData=='' && admitcardlink==''){
                        htmlData ='<tr><td colspan="3" style="padding:0;"><div id="errorText" class="alert alert-warning text-center">No Documents</div></td></tr>';
                        $('#ApplicantDocList').html(htmlData);
                    }else{
                        $('#ApplicantDocList').html(admitcardlink+htmlData);
                    }
                    $("#document-details").modal();
                    
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
        
        return;
    }
}

function deleteApplicationDetails(ApplicationId){
    if(ApplicationId){
        alertPopup('Getting error to open popup.');
    }
}
//common ajax function
function callAjaxRequest(ApplicationId,area,form_id){
    $.ajax({
            url: jsVars.SaveGetApplicationInfoUrl,
            type: 'post',
            data: {id:ApplicationId,area:area,form_id:form_id},
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
            success: function (json) 
            {
                if(json['redirect'])
                {
                    location = json['redirect'];
                }
                else if(json['error'])
                {
                    alertPopup(json['error'],'error');
                }
                else if(json['success'] == 200)
                {
                    if(area == 'onlinePaymentDetails')
                    {
                        $('#online-payment-details #CaptionTitle').text('Online Payment Details');
                        $('#online-payment-details div.modal-body').html(json['data']);
                        $('#OnlinePaymentDetailsBtn').trigger('click');
                    }    
                    else if(area == 'offlinePaymentDetails')
                    {
                        $('#online-payment-details #CaptionTitle').text('Offline Payment Details');
                        $('#online-payment-details div.modal-body').html(json['data']);
                        $('#OnlinePaymentDetailsBtn').trigger('click');
                    }
                    else if(area == 'freePaymentDetails')
                    {
                        $('#online-payment-details #CaptionTitle').text('Free Payment Details');
                        $('#online-payment-details div.modal-body').html(json['data']);
                        $('#OnlinePaymentDetailsBtn').trigger('click');
                    }
                    else if(area == 'demandDraftDetails')
                    {
                        $('#PaidBy').val(json['data']['PaidBy']);
                        $('#DDNumber').val(json['data']['DDNumber']);
                        $('#DDDate').val(json['data']['DDDate']);
                        $('#DrawnOn').val(json['data']['DrawnOn']);
                        $('#Branch').val(json['data']['Branch']);
                        $('#DDRecievedDate').val(json['data']['DDRecievedDate']);
                        $('#LastModifiedBy').text(json['data']['LastModifiedBy']);
                        if(json['data']['DDRecievedDate'] != '')
                        { 
                            $('#DDRecievedDate').css('border','none');
                            $('#DDRecieved').attr('checked',true);
                            $('#DDDate, #DDRecievedDate, #DDRecieved').attr('disabled',true);
                            $('#buttonSection').html('<button type="button" class="btn btn-default btn-npf btn-npf-alt"  data-dismiss="modal" >Close</button>');
                        }
                        else if(json['data']['DDRecievedDate'] == '')
                        {
                            $('#buttonSection').html('<button type="button" class="btn btn-default btn-npf" id="SaveDDStatus">Save</button><button type="button" class="btn btn-default btn-npf btn-npf-alt"  data-dismiss="modal" >Cancel</button>');
                            $('#SaveDDStatus').attr('onclick','UpdateDemandDraftDetails('+ApplicationId+','+form_id+');');
                            $('#DDRecieved').attr('checked',false);
                            $('#DDRecievedDate, #DDRecieved').attr('disabled',false);
                        }
                        $('#DemandDraftBtn').trigger('click');
                    }
                    else if(area == 'voucherDetails')
                    {
                        $('#voucher-payment-details div.modal-body').html(json['data']);
                        $('#VoucherPaymentDetailsBtn').trigger('click');                        
                    }                                        
                }    
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    return;    
}

// function: Get All Forms of a College
function GetAllRelatedForms(CollegeId,Condition){
    if(CollegeId && Condition){
        $.ajax({
            url: jsVars.GetAllRelatedFormUrl,
            type: 'post',
            data: {CollegeId:CollegeId,Condition:Condition},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (json) 
            {
                if(json['redirect'])location = json['redirect'];
                else if(json['error'])alertPopup(json['error'],'error');
                else if(json['success'] == 200){  
                     var html="<select name='Filter[form_id]' id='InstituteForms' class='chosen-select'><option value=''>Select Form</option>";
                      for (var key in json["FormList"]){
                          html+="<option value='"+key+"'>"+json["FormList"][key]+"</option>";
                      }
                      html+="</select>";
                      $('#InstituteForms').parent("div").html(html);
                      $('#InstituteForms').chosen();
                }    
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }    
}


// function: Get All Forms of a College
function LoadMoreApplication(){
    
    
    var data_save = $('#FilterApplicationForm').serializeArray();
     data_save.push({name:"form_id",value:jsVars.form_id});
     data_save.push({name:"page",value:Page});
     
        $('#load_more_button').attr("disabled", "disabled");
        $('#load_more_button').html("Loading...");
        $.ajax({
            url: '/applications/more-listings',
            type: 'post',
            dataType: 'html',
            data:  data_save,
            /*data: {
                "data": data_save,
                "form_id": jsVars.form_id,
                "page": Page
            },*/
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            success: function (response) {
                Page = Page + 1;
                if (response == "error") {
                    $('#load_more_results').append("<div class='alert alert-danger'>No More Records</div>");
                    $('#load_more_button').hide();
                }
                else {
                   /* $('#load_more_results').append(data);
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html("Next Page");
                    $.material.init();*/
                     $('div.select-block-container #LoadMoreArea').remove();
                     $('div.select-block-container').append(response);
                }
                //console.log(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    
    /*var page,loadedApplications;
    var countApplication = parseInt($('div.select-option-block').length);
    
    if(countApplication <= jsVars.APPLICATION_START_PAGE)
    {
        page = 2;
    }
    else if(countApplication > jsVars.APPLICATION_START_PAGE)
    {
        loadedApplications = countApplication - jsVars.APPLICATION_START_PAGE;
        page = countApplication / jsVars.ITEM_PER_PAGE;
        page = page + 1;
    }
     
    
    if(page > 0)
    {
        $.ajax({
            url: jsVars.loadMoreApplicationsUrl + '?page=' + page,
            type: 'post',
            data: $('#FilterApplicationForm input, #FilterApplicationForm select'),
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function() {                    
                    $('div.select-block-container #LoadMoreArea').text('Loading...');
            },
            complete: function() {
                    $('div.select-block-container #LoadMoreArea').text('');
                    $('div.select-block-container #LoadMoreArea').html('<input type="button" onclick="LoadMoreApplication();" value="Load More Applications" class="btn btn-default w-text npf-btn">');
            },
            success: function (response){
                $('div.select-block-container #LoadMoreArea').remove();
                $('div.select-block-container').append(response);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.select-block-container #LoadMoreArea').html('<input type="button" onclick="LoadMoreApplication();" value="Load More Applications" class="btn btn-default w-text npf-btn">');
            }
        });
    }    */
}

function GetFormRelatedFieldsUrl(FormId){
    $.ajax({
            url: jsVars.GetFormRelatedFieldsUrl,
            type: 'post',
            data: {form_id:FormId},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (response){
                jsVars.FormSelectFields = response;
                $('#SelectBoxArea').html(response);
                $('.advance-filter-block').removeClass('display-none');
                $('.chosen-select').chosen();
                if(typeof jsVars.AdvancedSearch != 'undefined'){
                    var searchFields =  jsVars.AdvancedSearch.search;
                    var start = 1;
                    for(var index in searchFields){
                        if(start == 1){
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select option[value=\''+ searchFields[index] +'\']').attr('selected', true)
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select').trigger('chosen:updated');
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select').trigger('change');
                        }else{
                            $('#AddMoreSearchButton').trigger('click');
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select option[value=\''+ searchFields[index] +'\']').attr('selected', true)
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select').trigger('chosen:updated');
                            $('#SelectBoxArea .row:nth-child('+ start +') #SelectArea select.chosen-select').trigger('change');
                        }
                        start++;
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                //$('div.select-block-container #LoadMoreArea').html('<input type="button" onclick="LoadMoreApplication();" value="Load More Applications" class="btn btn-default w-text npf-btn">');
            }
        });
}

function GenrateHtmlField(KeyArray, CurrentObj,PreSelect){
    var Colomn = KeyArray[0];
    var FieldType = KeyArray[1];    
    var Html = '';
    switch(FieldType) {
        case 'textbox':
            Html += '<div class="col-md-4" id="ValueArea">';
            Html += '   <div class="form-group formAreaCols">';
            Html += '       <input type="text" class="form-control" name="Filter[Advanced][value]['+ Colomn +']" placeholder="Search Text" value="'+ PreSelect +'"/>';
            Html += '   </div>';
            Html += '</div>';
            break;
        case 'machine_key':
            if (typeof KeyArray[2] != 'undefined') {
                var MachineKey = KeyArray[2];
                GetMachineKeyOption(MachineKey,Colomn,CurrentObj,PreSelect);
            }            
            break;
        case 'dropdown':
            if (typeof KeyArray[2] != 'undefined') {
                var options = JSON.parse(KeyArray[2]);
            }
            Html += '<div class="col-md-4" id="ValueArea">';
            Html += '   <div class="form-group formAreaCols">';
            Html += '       <select name="Filter[Advanced][value]['+ Colomn +']"  class="chosen-select">';
            Html += '           <option value="">Select Option</option>';
            if(typeof options != 'undefined'){
                for(var index in options){
                    if(PreSelect == options[index]){
                        Html += '   <option value="'+ options[index] +'" selected="selected">'+ options[index] +'</option>';
                    }
                    else{
                        Html += '   <option value="'+ options[index] +'">'+ options[index] +'</option>';
                    }
                }
            }
            Html += '   </select>';
            Html += '   </div>';
            Html += '</div>';
            break;
        case 'date':
            Html += '<div class="col-md-4" id="ValueArea">';
            Html += '   <div class="form-group formAreaCols">';
            Html += '       <input type="text" class="form-control datepicker" name="Filter[Advanced][value]['+ Colomn +']" placeholder="Select Date" readonly value="'+ PreSelect +'"/>';
            Html += '   </div>';
            Html += '</div>';
            break;
        default:
            '';
    } 
    return Html;
}

function GetMachineKeyOption(MachineKey,field_id,CurrentObj,PreSelect){
    $.ajax({
            url: jsVars.GetMachineKeyFieldsUrl,
            type: 'post',
            data: {key:MachineKey,field_id:field_id, selected_value:PreSelect,place_holder:'Select value'},
            dataType: 'html',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (response) {
                var Html = '<div class="col-md-4" id="ValueArea">';
                Html += '   <div class="form-group formAreaCols">';
                Html += '       <select name="Filter[Advanced][value]['+ field_id +']"  class="chosen-select">';
                Html += response;
                Html += '   </select>';
                Html += '   </div>';
                Html += '</div>';
                var TopParent = $(CurrentObj).parents('div#SelectArea').parent();
                if($(TopParent).find('div#ValueArea').length > 0){
                    $(TopParent).find('div#ValueArea').remove();
                }
                $(TopParent).append(Html);
                $('.chosen-select').chosen();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                //$('div.select-block-container #LoadMoreArea').html('<input type="button" onclick="LoadMoreApplication();" value="Load More Applications" class="btn btn-default w-text npf-btn">');
            }
        });  
}

function UpdateStateList(college_id,form_id,sel_value){
    $.ajax({
        url: '/applications/get-state-lists',
        type: 'post',
        dataType: 'html',
        data: {
            college_id: college_id,
            form_id: form_id,
            sel_value:sel_value
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#InstituteState').parent("div").html(data);
            //console.log(data);
            $('#InstituteState').chosen();
           // $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function UpdateCreatedByList(college_id,form_id,sel_value){
    $.ajax({
        url: '/applications/get-created-lists',
        type: 'post',
        dataType: 'html',
        data: {
            college_id: college_id,
            form_id: form_id,
            sel_value:sel_value
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('#CreatedBySelect').parent("div").html(data);
            //console.log(data);
            $('#CreatedBySelect').chosen();
           // $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

     
}

LoadDateTimePickerFilter();