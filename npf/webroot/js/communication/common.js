$(function () {
    $(document).on('click', '#isRecurring', function (e) {
       if ($(this).is(':checked')) {
           getRecurringCommunication("recurring");
       }else{
           getRecurringCommunication("");
       }
   });
   hiddenElements = $(':hidden');
   visibleElements = $(':visible');

   //Create/Edit Communication Template Pgae
   if ($('#CreateCommunicationTemplateSection').length > 0) {

       //File upload progress bar
       $(document).on('submit', 'form#TemplateCreationForm',function(e) {
           if($('#EmailUpload').val()) {
               e.preventDefault();
               $('div.loader-block').show();
               $(this).ajaxSubmit({
                   //target:   '#UploadFileInfoContainer',
                   beforeSubmit: function() {
                       $("#progress-bar").show();
                       $("#progress-bar").width('0%');
                   },
                   uploadProgress: function (event, position, total, percentComplete){

                       $("#progress-bar").width(percentComplete + '%');
                       $("#progress-bar").html('<div id="progress-status">' + percentComplete +' %</div>')
                   },
                   success:function (data){
                       //console.log(data);
                       $('#UploadFileInfoContainer').append(data);
                       $('#EmailUpload').val('');
                       $("#progress-bar").hide();
                       $('div.loader-block').hide();
                   },
                   resetForm: false
               });
               return false;
           }
           else if($('#VoiceUpload').val()) {
               e.preventDefault();
               $('div.loader-block').show();
               $(this).ajaxSubmit({
                   //target:   '#UploadFileInfoContainer',
                   beforeSubmit: function() {
                       $("#voive-progress-bar").show();
                       $("#voive-progress-bar").width('0%');
                   },
                   uploadProgress: function (event, position, total, percentComplete){

                       $("#voive-progress-bar").width(percentComplete + '%');
                       $("#voive-progress-bar").html('<div id="progress-status">' + percentComplete +' %</div>')
                   },
                   success:function (data){
                       //console.log(data);
                       $('#UploadVoiceFileInfoContainer').append(data);
                       $('#VoiceUpload').val('');
                       $("#voive-progress-bar").hide();
                       $('div.loader-block').hide();
                   },
                   resetForm: false
               });
               return false;
           }
           else if($('#WhatsappUpload').val()) {
               e.preventDefault();
               $('div.loader-block').show();
               $(this).ajaxSubmit({
                   //target:   '#UploadFileInfoContainer',
                   beforeSubmit: function() {
                       $("#whatsapp-progress-bar").show();
                       $("#whatsapp-progress-bar").width('0%');
                   },
                   uploadProgress: function (event, position, total, percentComplete){

                       $("#whatsapp-progress-bar").width(percentComplete + '%');
                       $("#whatsapp-progress-bar").html('<div id="progress-status">' + percentComplete +' %</div>')
                   },
                   success:function (data){
                       //console.log(data);
                       $('#UploadWhatsappFileInfoContainer').append(data);
                       $('#WhatsappUpload').val('');
                       $('.whatsapp-attached .requiredError').html('');
                       $("#whatsapp-progress-bar").hide();
                       $('div.loader-block').hide();
                   },
                   resetForm: false
               });
               return false;
           }
       });

       //On College Change
       $(document).on('change', 'select#CollegeIdSelect', function () {
           $("#applicableSelect").selected = false;
           $("#applicableSelect").val('').trigger("chosen:updated");
           var CollegeId;
           if (this.value)
           {
               CollegeId = this.value;
               var Condition = 'only_enable_form';
               GetAllRelatedForms(CollegeId, Condition);
               GetCollegeAssociatedUserList(CollegeId);
               GetCollegeNFormMachineKeyList(CollegeId,0);
               GetCollegeNApplicableForList(CollegeId,'applicableSelect');
               var templateType = $('#template-type').val();
               getAllDocumentList(CollegeId,0,null,templateType);
               if($.inArray($('input[name="template_type"]').val(), ['email', 'list_email', 'segment_email', 'exam_email']) > -1) {
                   $('.content_container').hide();
               } else {
                   $('.content_container').show();
               }
           } else
           {
               $('#FormIdSelect').html('<option value="">Select Form(s)</option>');
               $('#UserAccessListSelect').html('');
               $('#FormIdSelect, #UserAccessListSelect').trigger('chosen:updated');
               CKEDITOR.instances['editor'].setData('');
               //instead of $(textarea).val(result);
           }
       });

       if(jsVars.CollegeId!='undefined') {
           var Condition = 'only_enable_form';
           GetAllRelatedForms(jsVars.CollegeId, Condition);
           GetCollegeAssociatedUserList(jsVars.CollegeId);
           GetCollegeNFormMachineKeyList(jsVars.CollegeId,0);
       }

       //FormIdSelect
       $(document).on('change', 'select#FormIdSelect', function () {
           var FormId;
           var CollegeId = $('select#CollegeIdSelect').val();
           var templateType = $('#template-type').val();
           displayWhatsappAttachmentDocumentList();
           if (this.value)
           {
               FormId = this.value;
               GetCollegeNFormMachineKeyList(CollegeId,FormId);
               getAllDocumentList(CollegeId,FormId,null,templateType);
           }else{
               GetCollegeNFormMachineKeyList(CollegeId,0);
               getAllDocumentList(CollegeId,0,null,templateType);
           }
       });

       //on Template Type Change
       $(document).on('change', 'select#TemplateTypeSelect', function () {
           var TemplateType;
           if (this.value)
           {
               TemplateType = this.value;
               if (TemplateType == 'email' || TemplateType == 'list_email' || TemplateType == 'segment_email')
               {
                   $('#SMSAreaParentDiv,#VoiceAreaParentDiv,#WhatsAppAreaParentDiv,#WhatsAppBusinessAreaParentDiv').removeClass('display-blk').removeClass('display-none');
                   $('#SMSAreaParentDiv,#VoiceAreaParentDiv,#WhatsAppAreaParentDiv,#WhatsAppBusinessAreaParentDiv').addClass('display-none');

                   $('#EmailAreaParentDiv').removeClass('display-blk').removeClass('display-none');
                   $('#EmailAreaParentDiv').addClass('display-blk');
               }
               else if (TemplateType == 'sms' || TemplateType == 'list_sms' || TemplateType == 'segment_sms')
               {
                   $('#EmailAreaParentDiv,#VoiceAreaParentDiv,#WhatsAppAreaParentDiv,#WhatsAppBusinessAreaParentDiv').removeClass('display-blk').removeClass('display-none');
                   $('#EmailAreaParentDiv,#VoiceAreaParentDiv,#WhatsAppAreaParentDiv,#WhatsAppBusinessAreaParentDiv').addClass('display-none');

                   $('#SMSAreaParentDiv').removeClass('display-blk').removeClass('display-none');
                   $('#SMSAreaParentDiv').addClass('display-blk');
               }
               else if (TemplateType == 'whatsapp')
               {
                   $('#EmailAreaParentDiv,#VoiceAreaParentDiv,#SMSAreaParentDiv,#WhatsAppBusinessAreaParentDiv').removeClass('display-blk').removeClass('display-none');
                   $('#EmailAreaParentDiv,#VoiceAreaParentDiv,#SMSAreaParentDiv,#WhatsAppBusinessAreaParentDiv').addClass('display-none');

                   $('#WhatsAppAreaParentDiv').removeClass('display-blk').removeClass('display-none');
                   $('#WhatsAppAreaParentDiv').addClass('display-blk');
               }
               else if (TemplateType == 'voice')
               {
                   $('#EmailAreaParentDiv,#SMSAreaParentDiv,#WhatsAppAreaParentDiv,#WhatsAppBusinessAreaParentDiv').removeClass('display-blk').removeClass('display-none');
                   $('#EmailAreaParentDiv,#SMSAreaParentDiv,#WhatsAppAreaParentDiv,#WhatsAppBusinessAreaParentDiv').addClass('display-none');

                   $('#VoiceAreaParentDiv').removeClass('display-blk').removeClass('display-none');
                   $('#VoiceAreaParentDiv').addClass('display-blk');
               }else if (TemplateType == 'whatsapp_business')
               {
                   $('#EmailAreaParentDiv,#VoiceAreaParentDiv,#SMSAreaParentDiv,#WhatsAppAreaParentDiv').removeClass('display-blk').removeClass('display-none');
                   $('#EmailAreaParentDiv,#VoiceAreaParentDiv,#SMSAreaParentDiv,#WhatsAppAreaParentDiv').addClass('display-none');

                   $('#WhatsAppBusinessAreaParentDiv').removeClass('display-blk').removeClass('display-none');
                   $('#WhatsAppBusinessAreaParentDiv').addClass('display-blk');
               }
               if($.inArray(TemplateType, ['email', 'list_email', 'segment_email', 'exam_email']) > -1) {
                   $('.content_container').hide();
                   if($('#TemplateCreationSubmitBtn').length > 0) $('#TemplateCreationSubmitBtn').html('Save and Next');
               } else {
                   $('.content_container').show();
                   if($('#template_id').length > 0) {
                       if($('#TemplateCreationSubmitBtn').length > 0)  $('#TemplateCreationSubmitBtn').html('Save');
                   } else {
                       if($('#TemplateCreationSubmitBtn').length > 0)  $('#TemplateCreationSubmitBtn').html('Create');
                   }
               }
           }
       });

       //on Template Type Change
       $(document).on('change', 'select#PredefinedTemplateSelect', function () {
           var DefaultTemplate;
           if (this.value)
           {
               DefaultTemplate = this.value;
               getPreDefinedTemplateHtml(DefaultTemplate);
           } else
           {
               CKEDITOR.instances['editor'].setData('');
               //instead of $(textarea).val(result);
           }
       });

       //Machine Key Render In Text Area (SMS)
       var $SMSTextArea = $("#SMSTextArea");
       $("#SMSMappingSeletct").change(function (e) {
           e.preventDefault();
           switch (this.name) {
                   case "machineKeys":
                       if(this.value != '') $SMSTextArea.replaceSelectedText("{{"+this.value+"}}", "collapseToEnd");
                       break;
               }
               $SMSTextArea.focus();

               // For IE, which always shifts the focus onto the button
               window.setTimeout(function() {
                   $SMSTextArea.focus();
               }, 0);
       });

       //Machine Key Render In Text Area (WhatsApp)
       var $WhatsAppTextArea = $("#WhatsAppTextArea");
       $("#WhatsAppMappingSelect").change(function (e) {
           e.preventDefault();
           switch (this.name) {
                   case "whatsAppmachineKeys":
                       if(this.value != '') $WhatsAppTextArea.replaceSelectedText("{{"+this.value+"}}", "collapseToEnd");
                       break;
               }
               $WhatsAppTextArea.focus();

               // For IE, which always shifts the focus onto the button
               window.setTimeout(function() {
                   $WhatsAppTextArea.focus();
               }, 0);
       });

       //Machine Key Render In SUBJECT Area (EMAIL)
       var $EmailTextArea = $("#subject");
       $("#EmailMappingSeletct").change(function (e) {
           e.preventDefault();
           switch (this.name) {
               case "emailmachineKeys":
                   if(this.value != '') $EmailTextArea.replaceSelectedText("{{"+this.value+"}}", "collapseToEnd");
                   break;
           }
           $EmailTextArea.focus();
           window.setTimeout(function() {
               $EmailTextArea.focus();
           }, 0);
       });

       //Machine Key Render In Text Area (Notification)
       if ($('#NotificationMappingSeletct').length > 0) {
           var $NotificationTextArea = $("#NotificationTextArea");
           $("#NotificationMappingSeletct").change(function (e) {
               e.preventDefault();
               switch (this.name) {
                       case "notificationmachineKeys":
                           if(this.value != '') $NotificationTextArea.replaceSelectedText("{{"+this.value+"}}", "collapseToEnd");
                           break;
                   }
                   $NotificationTextArea.focus();

                   // For IE, which always shifts the focus onto the button
                   window.setTimeout(function() {
                       $NotificationTextArea.focus();
                   }, 0);
           });
       }
   }

   //Machine Key Render In Text Area (WhatsApp Business)
   var $WhatsAppBusinessTextArea = $("#WhatsAppBusinessTextArea");
   $("#WhatsAppBusinessMappingSelect").change(function (e) {
       e.preventDefault();
       switch (this.name) {
               case "whatsAppBusinessmachineKeys":
                   if (this.value.indexOf('static.') !== -1) {
                       $WhatsAppBusinessTextArea.replaceSelectedText("@@"+this.value+"@@", "collapseToEnd");
                   }else{
                       $WhatsAppBusinessTextArea.replaceSelectedText("{{"+this.value+"}}", "collapseToEnd");
                   }
                   break;
           }
           $WhatsAppBusinessTextArea.focus();

           // For IE, which always shifts the focus onto the button
           window.setTimeout(function() {
               $WhatsAppBusinessTextArea.focus();
           }, 0);
   });


   //Manage Communication Template
//    if ($('#FilterCommunicationManageTemplateForm #searchCommunicationTemplate').length > 0) {
//        //Manage Application Search Field
//        $('#FilterCommunicationManageTemplateForm #searchCommunicationTemplate').typeahead({
//            hint: true,
//            highlight: true,
//            minLength: 1
//            , source: function (request, response) {
//                var search = $('#FilterCommunicationManageTemplateForm #searchCommunicationTemplate').val();
//                if (search)
//                {
//                    $.ajax({
//                        url: jsVars.serachTemplateByNameUrl,
//                        data: {search: search, area: 'communication'},
//                        dataType: "json",
//                        type: "POST",
//                        headers: {
//                            "X-CSRF-Token": jsVars._csrfToken
//                        },
//                        //contentType: "application/json; charset=utf-8",
//                        success: function (data) {
//                            items = [];
//                            map = {};
//                            $.each(data.listReports, function (i, item) {
//                                //console.log(j);console.log(item2.application_no);
//                                var name = item;
//                                map[name] = {name: name};
//                                items.push(name);
//                            });
//                            response(items);
//                            $(".dropdown-menu").css("height", "auto");
//                        },
//                        error: function (response) {
//                            alertPopup(response.responseText);
//                        },
//                        failure: function (response) {
//                            alertPopup(response.responseText);
//                        }
//                    });
//                }
//            },
//        });
//    }

   if ($('#manageTemplateStartDate').length > 0) {
       //$('#applicationDeadLineSelector').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true, pickTime: false});
       $('#manageTemplateStartDate').datepicker({startView: 'month', format: 'd M yyyy', enableYearToMonth: true, enableMonthToDay: true});
   }

   if ($('#manageTemplateEndDate').length > 0) {
       //$('#applicationDeadLineSelector').datepicker({startView: 'month', format: 'dd/mm/yyyy', enableYearToMonth: true, enableMonthToDay: true, pickTime: false});
       $('#manageTemplateEndDate').datepicker({startView: 'month', format: 'd M yyyy', enableYearToMonth: true, enableMonthToDay: true});
   }

   if (jsVars.filterOpen == 1) {
       $('#filterSearchlnk').click();
   }

   if (('.TemplateStatusChangeBtn').length > 0) {
       $(document).on('click', '.TemplateStatusChangeBtn', function (e) {
           e.preventDefault();
           var status_details = $(this).attr('rel');
           var status_details_array = status_details.split('_');


           $('#confirmTitle').html("Confirm");
           var statusText = (status_details_array[1] == 1) ? 'enable' : 'disable';
           $('#ConfirmMsgBody').html('Are you sure you want to ' + statusText + ' this template?');
           $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
           .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
           e.preventDefault();

               changeCommunicationTemplateStatus(status_details);
           });


       });
   }

   if (('#communicationTemplateDelete').length > 0) {
       $(document).on('click', '#communicationTemplateDelete', function (e) {
           e.preventDefault();
           var templateId = $(this).attr("rel");
           if (templateId > 0)
           {
               $("#ConfirmPopupArea p#ConfirmMsgBody").text('Are you sure you want to delete this template?');
               $('#SuccessPopupArea .modal-header h2#alertTitle').html('Success');
               $('#SuccessPopupArea .modal-header button.close').html('<span aria-hidden="true">×</span>');
               $('#ChangeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text('Communication Template has been deleted.');
               $("#ConfirmPopupArea a#confirmYes").attr("onclick", 'communicationTemplateDelete(' + templateId + '\);');
           } else
           {
               alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
           }
       });
   }

   if (('#communicationTemplateApprove').length > 0) {
       $(document).on('click', '#communicationTemplateApprove', function (e) {
           e.preventDefault();
           var templateId = $(this).attr("rel");
           var status = $(this).attr("data-status");
           var type = $(this).attr("data-type");
           if(status === '31'){
               var label = 'approve';
           }else{
               var label = 'disapprove';
           }
           if (templateId > 0)
           {
               $("#ConfirmPopupArea p#ConfirmMsgBody").text('Are you sure you want to '+label+' this template?');
               $('#SuccessPopupArea .modal-header h2#alertTitle').html('Success');
               $('#SuccessPopupArea .modal-header button.close').html('<span aria-hidden="true">×</span>');
               $('#ChangeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text('Communication Template has been Approve.');
               $("#ConfirmPopupArea a#confirmYes").attr("onclick", 'communicationTemplateApprove(' + templateId + ','+status+',"'+type+'")');
           } else
           {
               alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
           }
       });
   }

   if (('#communicationTemplateCopy').length > 0) {
       $(document).on('click', '#communicationTemplateCopy', function (e) {
           e.preventDefault();
           var templateId = $(this).attr("rel");
           if (templateId > 0)
           {
               $("#ConfirmPopupArea p#ConfirmMsgBody").text('Are you sure you want to copy this template?');
               $('#SuccessPopupArea .modal-header h2#alertTitle').html('Success');
               $('#SuccessPopupArea .modal-header button.close').html('<span aria-hidden="true">×</span>');
               $('#ChangeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text('Communication Template has been copied.');
               $("#ConfirmPopupArea a#confirmYes").attr("onclick", 'communicationTemplateCopy(' + templateId + '\);');
           } else
           {
               alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
           }
       });
   }

   if (('#communicationTemplatePreview').length > 0) {
       $(document).on('click', '#communicationTemplatePreview', function (e) {
           e.preventDefault();
           $('.dropdown-stop-propagation').removeClass('hide');
           var templateId = $(this).attr("rel");
           var revisionId = $(this).attr("revision");
           if (templateId > 0)
           {

               var html = getTemplateText(templateId,revisionId);
               $('#templatePreviewModal .modal-body').addClass('customBodyHeight').css({"height": "calc(100% - 100px)", "padding-bottom": "15px","overflow":"hidden"});
               
               $('.modal-backdrop+.modal-backdrop').hide();
               $('[data-toggle="tooltip"]').tooltip()
               $('#OkBtn').hide();
               $('.modal-backdrop').addClass('in');
               if($(this).data("type") == 'email') {
                   $('#templatePreviewModal #MsgBody').html(html).css({"margin":"0","height":"100%"});
               } else {
                   $('#templatePreviewModal #MsgBody').html(html).css({"margin":"0","height":"100%"});

               }
               
               if(revisionId){
                   $('#templatePreviewModal h2#templatePreviewModalLabel').html('<a data-placement="right" data-toggle="tooltip" data-trigger="hover" title="Back to previous" href="javascript:void(0)" data-dismiss="modal" ><i class="fa fa-chevron-circle-left" aria-hidden="true"></i></a> Template Preview');
               }else{
                   if($(this).data("title")!='undefined' && $(this).data("type")!=''){ var title = $(this).data("title");}else{ var title = 'Template Preview'; }
                   $('#templatePreviewModal h2#templatePreviewModalLabel').html('<span class="templatename" data-toggle="tooltip" title="'+title+'" data-placement="bottom">'+title+'</span><span class="versionname margin-left-8">(v'+$("#"+templateId).text()+')</span>');
                   $('[data-toggle="tooltip"]').tooltip();                   
               }
                var emailBox = '';
                if($(this).data("type") == 'email') {
                    $(".email-btn").find("span").removeClass('draw-whatsapp');
                    $(".email-btn").find("span").removeClass('draw-mobile2');
                    $(".email-btn").find("span").addClass('draw-communication');
                    $('.draw-communication').attr('title','').attr('data-original-title','Test Email');
                    emailBox +='<div class="row"><div class="col-sm-7">';
                    emailBox +='<input type="text" id="comm_test_email_id" name="comm_test_email_id" placeholder="Enter Test Email Id" class="form-control">';
                    emailBox +='</div>';
                    emailBox +='<button type="button" class="btn btn-sm mr-10" data-toggle="dropdown">Cancel</button><button type="button" class="btn btn-sm btn-fill-blue" id="text_email_id_btn" onclick="javascript:sendTestEmailTemplateCommunication();">Send</button></div></div></div>';
                   $("#testCommunicationContent").html(emailBox);
                }
                var smsBox = '';
                if($(this).data("type") == 'sms') {
                    $(".email-btn").find("span").removeClass('draw-whatsapp');
                    $(".email-btn").find("span").removeClass('draw-communication');
                    $(".email-btn").find("span").addClass('draw-mobile2');
                    $('.draw-mobile2').attr('title','').attr('data-original-title','Test SMS');
                    smsBox +='<div class="row"><div class="col-sm-7">';
                    smsBox +='<input type="text" id="comm_test_sms_id" name="comm_test_sms_id" placeholder="Enter Test Mobile No" maxlength="10" onkeypress="return isNumberKey(event)" class="form-control">';
                    smsBox +='</div>';
                    smsBox +='<button type="button" class="btn btn-sm mr-10" data-toggle="dropdown">Cancel</button><button type="button" class="btn btn-sm btn-fill-blue" id="text_email_id_btn" onclick="javascript:sendTestSMSTemplateCommunication();">Send</button></div></div></div>';
                   $("#testCommunicationContent").html(smsBox);
                }
                var whatsappBox = '';
                if($(this).data("type") == 'whatsapp' || $(this).data("type") == 'whatsapp_business') {
                    var dataVal = $(this).attr("data-val");                    
                    $(".email-btn").find("span").removeClass('draw-mobile2');
                    $(".email-btn").find("span").removeClass('draw-communication');
                    $(".email-btn").find("span").addClass('draw-whatsapp');
                    $('.draw-whatsapp').attr('title','').attr('data-original-title','Test WhatsApp');
                    if(dataVal == '51'){
                        $('.dropdown-stop-propagation').addClass('hide');
                    }
                    whatsappBox +='<div class="row"><div class="col-sm-7">';
                    whatsappBox +='<input type="text" id="comm_test_whatsapp_id" name="comm_test_whatsapp_id" placeholder="Enter Test Mobile No" maxlength="10" onkeypress="return isNumberKey(event)" class="form-control">';
                    whatsappBox +='</div>';
                    whatsappBox +='<button type="button" class="btn btn-sm mr-10" data-toggle="dropdown">Cancel</button><button type="button" class="btn btn-sm btn-fill-blue" id="text_email_id_btn" onclick="javascript:sendTestWhatsappTemplateCommunication();">Send</button></div></div></div>';
                   $("#testCommunicationContent").html(whatsappBox);
                }
               $('#templatePreviewModal #MsgBody iframe').css({"height":"calc(100%)","background-color":"#fff"});
               setTimeout(function(){
                   $('#templatePreviewModal #MsgBody iframe').show();
                }, 1000);

           } else
           {
               alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
           }
       });
   }



   //template preview fix
   $('#SuccessPopupArea').on('hidden.bs.modal', function (e) {
       $('#SuccessPopupArea').removeClass('modalWide right offCanvasModal');
       $('#SuccessPopupArea .modal-header').removeClass('offCanvasModalheader');
       $('#SuccessPopupArea .modal-body').addClass('text-center');
       $('#SuccessPopupArea p#MsgBody').css({"height":"","margin":""});
   });

   if (('#showDLTCommunicationTemplate').length > 0) {
       $(document).on('click', '#showDLTCommunicationTemplate', function (e) {
           e.preventDefault();
           var templateId = $(this).attr("rel");
           if (templateId > 0)
           {
               var html = showDltTemplateText(templateId);
                   $('#SuccessPopupArea').addClass('modalWide right offCanvasModal');
                   $('#SuccessPopupArea .modal-dialog').addClass('modal-sm').css('left','auto');
                   $('#SuccessPopupArea .modal-header').addClass('offCanvasModalheader');
                   $('#SuccessPopupArea .modal-header button.close').html('<span class="glyphicon glyphicon-remove"></span>');
                   $('#SuccessPopupArea .modal-body').removeClass('text-center');
                   $('#SuccessPopupArea h2#alertTitle').html('DLT Template Preview');
               console.log(html.applicable_for);
               elm = ['<div id="subject-preview" style="background:#fff; display: table; padding:5px; font-size:15px;">',
                       '<strong style="width:80px; display:table-cell;">Name:</strong>',
                       html.name,
                       '</div>',
                       '<div id="subject-preview" style="background:#fff; display: table; padding:5px; font-size:15px;">',
                       '<strong style="width:80px; display:table-cell;">Type:</strong>',
                       html.applicable_for,
                       '</div>',
                       '<div style="padding:5px; display: table;">','<strong style="width:80px; display:table-cell;">Content:</strong>',html.dlt_template_text,'</div>'];
               $('#SuccessPopupArea p#MsgBody').html(elm.join(' '));
               $('#SuccessPopupArea').modal('show');
               $('#OkBtn').hide();
               $('#SuccessPopupArea span.oktick').hide();
           } else
           {
               alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
           }
       });
   }

//    $(document).on('change', 'select#templateFormat', function () {
//        var templateFormat = this.value;
//        if (templateFormat)
//        {
//            if (templateFormat === 'image' || templateFormat === 'document' || templateFormat === 'audio' || templateFormat === 'video')
//            {
//                $('.whatsapp-attached').removeClass('display-blk').removeClass('display-none');
//                $('.whatsapp-attached').addClass('display-blk');
//            }else{
//                $('.whatsapp-attached').removeClass('display-blk').removeClass('display-none');
//                $('.whatsapp-attached').addClass('display-none');
//            }
//
//            var applicableSelect = $("#applicableSelect").val();
//            if(applicableSelect === 'applications' && templateFormat === 'document'){
//                $('.whatsapp-document').removeClass('display-blk').removeClass('display-none');
//                $('.whatsapp-document').addClass('display-blk');
//            }
//            else{
//                $('.whatsapp-document').removeClass('display-blk').removeClass('display-none');
//                $('.whatsapp-document').addClass('display-none');
//            }
//        }
//    });

//    $(document).on('change', 'select#applicableSelect', function () {
//
//
////        var templateFormat = $("#templateFormat").val();
////        var applicableSelect = this.value;
////        if(applicableSelect === 'applications' && templateFormat === 'document'){
////            $('.whatsapp-document').removeClass('display-blk').removeClass('display-none');
////            $('.whatsapp-document').addClass('display-blk');
////        }else{
////            $('.whatsapp-document').removeClass('display-blk').removeClass('display-none');
////            $('.whatsapp-document').addClass('display-none');
////        }
//    });

   $(document).on('change', '.whatsapp_type', function () {
       var whatsappType = this.value;
       var user_id = $("#user_id").val();
       var form_id = $("#form_id").val();
       var ctype = $("#ctype").val();
       var college_id = $("#college_id").val();
       if (whatsappType === 'whatsapp')
       {
           communicationWhatsApp(user_id,form_id,ctype,college_id,'whatsapp');
       }else if (whatsappType === 'whatsapp_business')
       {
           communicationWhatsApp(user_id,form_id,ctype,college_id,'whatsapp_business');
       }
   });

   $(document).on('click', '#staticDoc,#dynamicDoc', function () {
       if($('#dynamicDoc').is(':checked')){
           $(".whatsapp-document").show();
           $(".whatsapp-attached").hide();
       }else{
           $(".whatsapp-document").hide();
           $('#whatsappDocuments').val('').trigger('chosen:updated');
           $(".whatsapp-attached").show();
       }
   });

   $(document).on('click', '#emailStaticDoc,#emailDynamicDoc', function () {
       if($('#emailDynamicDoc').is(':checked')){
           $(".email-document").show();
           $(".email-attached").hide();
       }else{
           $(".email-document").hide();
           $(".email-attached").show();
       }
   });
//   $('#emailStaticDoc').on('change',function(){
//       if($('#emailStaticDoc').val()=='static'){
//           $('#emailDocuments').val('').trigger('chosen:updated');
//       }
//   });
//   $('#emailDynamicDoc').on('change',function(e){
//       e.preventDefault();
//       if($('#emailDynamicDoc').val()=='dynamic'){
//           $('#UploadFileInfoContainer li span').trigger("click");
//           $('#UploadFileInfoContainer li span input').val("");
//       }
//   });
   
   
   $(document).on('click', '#UploadWhatsappFileInfoContainer li, #UploadFileInfoContainer li', function (e) {
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

   $(document).on('click', '#publish', function () {
       saveTemplate('publish');
   });

   $(document).on('click', '#draft', function () {
       saveTemplate('draft');
   });

   $(document).on('click', '#CommunicationBulkAction button.close', function () {
       $('#bulk_communication_html').html('');
   });

   $(document).on('click', '#CommunicationSingleAction button.close', function () {
       $('#single_communication_html').html('');
   });

   $(document).on('change', '.whatsapp_type_mobile', function () {
       communicationWhatsAppMobile(this.value);
   });

   $(document).on('input', '#subject', function () {
        if($("#TemplateListSelect").val() != '' && $("#subject").val() != '' && $("#is_edit_template").length > 0){
            $("#is_edit_template").val(1);
        }
    });

});

function communicationWhatsAppMobile(type){
   $('.whatsapp-mobile').html('');
   if(type === 'whatsapp_business') {
       var Url = '/communications/communication-whatsapp-business-app';
   }else{
       var Url = '/communications/communication-whatsapp-chat-app';
   }
   var dataval = $("#appFilterData").val();
   $.ajax({
       cache: false,
       url: Url,
       type: 'post',
       data: {'data':dataval},
       dataType: 'html',
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function() {
           $('.modalLoader').show();
       },
       complete: function() {
           $('.modalLoader').hide();
       },
       success: function (response) {
           $('.whatsapp-mobile').html(response);
           $('.chosen-select').trigger('chosen:updated');
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            $('#contact-us-final div.loader-block').hide();
       }
   });

 return;
}

//Return Html content of predefined ctp files
function getPreDefinedTemplateHtml(file) {

   $.ajax({
       url: '/communications/readDefaultTemplate',
       type: 'post',
       data: {File: file},
       dataType: 'json',
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function () {
           $('body div.loader-block').show();
       },
       complete: function () {
           $('body div.loader-block').hide();
       },
       //contentType: "application/json; charset=utf-8",
       success: function (json) {
           if (json['redirect'])
               location = json['redirect'];
           else if (json['error'])
               alertPopup(json['error'], 'error');
           else if (json['success'] == 200) {

               CKEDITOR.instances['editor'].setData(json['content']);
               //instead of $(textarea).val(result);
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

function getTemplateText(templateId,revisionId='') {
   var returnHTML = '';
   $.ajax({
       url: jsVars.communicationTemplateTextGet,
       data: {template_id: templateId,revision_id: revisionId},
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
       //contentType: "application/json; charset=utf-8",
       success: function (html) {
           if (html == 'session_logout') {
//                returnHTML = json['template_text'];
               location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
           }
           else if (html == 'invalid_request') {
               returnHTML = 'We got some error, please try again later.';
               alertPopup(returnHTML, 'error');
//                returnHTML = '<audio controls><source src="'+json['template_text']+'" type="audio/wav"></audio>';
           }
           else {
               returnHTML = html;
           }
           
           
       },
       error: function (response) {
           alertPopup(response.responseText);
       },
       failure: function (response) {
           alertPopup(response.responseText);
       }
   });
   return returnHTML;
}

function showDltTemplateText(templateId) {
   var returnHTML = '';
   $.ajax({
       url: jsVars.communicationTemplateTextGet,
       data: {template_id: templateId,type:'sms'},
       dataType: "json",
       async: false,
       cache: false,
       type: "POST",
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function () {
           $('body div.loader-block').show();
       },
       complete: function () {
           $('body div.loader-block').hide();
       },
       //contentType: "application/json; charset=utf-8",
       success: function (html) {
           if (html == 'session_logout') {
//                returnHTML = json['template_text'];
               location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
           }
           else if (html == 'invalid_request') {
               returnHTML = 'We got some error, please try again later.';
               alertPopup(returnHTML, 'error');
//                returnHTML = '<audio controls><source src="'+json['template_text']+'" type="audio/wav"></audio>';
           }
           else {
               returnHTML = html;
           }

       },
       error: function (response) {
           alertPopup(response.responseText);
       },
       failure: function (response) {
           alertPopup(response.responseText);
       }
   });
   return returnHTML;
}

function communicationTemplateDelete(templateId) {
   $('body div.loader-block').show();
   $("#ConfirmPopupArea").modal('hide');
   $.ajax({
       url: jsVars.communicationTemplateDelete,
       data: {template_id: templateId},
       dataType: "json",
       async: false,
       cache: false,
       type: "POST",
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       //contentType: "application/json; charset=utf-8",
       success: function (json) {
           $('body div.loader-block').hide();
           if (json['status'] == 1) {
               $('#SuccessPopupArea .modal-header h2#alertTitle').html('Success');
               $('#SuccessPopupArea .modal-header button.close').html('<span aria-hidden="true">×</span>');
               $('#SuccessPopupArea p#MsgBody').html('Communication Template has been deleted.');
               $('#SuccessPopupArea a#OkBtn').show();

               $("#SuccessPopupArea a#OkBtn").bind("click", function () {
                   $('#FilterCommunicationManageTemplateForm').submit();
               });
//                $('#SuccessPopupArea a#OkBtn').attr('href', '/colleges/manage-payment-configuration');
               $("#SuccessPopupArea").modal();
           } else {
               alert('We got some error, please try again later.')
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

function communicationTemplateCopy(templateId) {
   $.ajax({
       url: jsVars.communicationTemplateCopy,
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
           if (json['status'] == 1) {
               $('#SuccessPopupArea .modal-header h2#alertTitle').html('Success');
               $('#SuccessPopupArea .modal-header button.close').html('<span aria-hidden="true">×</span>');
               $('#SuccessPopupArea p#MsgBody').html('Communication Template has been copied.');
               $('#SuccessPopupArea a#OkBtn').show();

               $("#SuccessPopupArea a#OkBtn").bind("click", function () {
                   $('#FilterCommunicationManageTemplateForm').submit();
               });
//                $('#SuccessPopupArea a#OkBtn').attr('href', '/colleges/manage-payment-configuration');
               $("#SuccessPopupArea").modal();
           } else {
               alert('We got some error, please try again later.')
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

function changeCommunicationTemplateStatus(status_details) {
   var status_details_array = status_details.split('_');
   var last_text = $('.templateStatus_' + status_details_array[0]).html();
   $.ajax({
       url: jsVars.communicationTemplateChangeStatus,
       data: {config_data: status_details},
       dataType: "json",
       async: false,
       cache: false,
       type: "POST",
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function () {
           $('.templateStatus_' + status_details_array[0]).html('Wait..');
       },
       complete: function () {
           $('.templateStatus_' + status_details_array[0]).html(last_text);
           last_text = '';
           //$('body div.loader-block').hide();
       },
       //contentType: "application/json; charset=utf-8",
       success: function (json) {
           if (json['status'] == 1) {

               $('.' + json['btnClass']).attr('rel', json['btnRel']);
               $('.' + json['btnClass']).html(json['btnText']);

               $('.' + json['flagClass']).removeClass(json['flagRemoveClass']);
               $('.' + json['flagClass']).addClass(json['flagAddClass']);
               $('.' + json['flagClass']).attr('data-content', json['flagText'] + ' Template');

               $('.' + json['btnClass'] + ' > span').removeClass(json['removeClass']);
               $('.' + json['btnClass'] + ' > span').addClass(json['addClass']);
               $('.dropdown-menu-tc').hide();
               $('#filterSubmitBtn').trigger('click');
           } else if(typeof json['error'] != 'undefined' && json['error'] != '') {
               $("#ConfirmPopupArea").modal('hide');
               alertPopup(json['error'], 'error');
               return false;
           } else {
               //alert('We got some error, please try again later.')
               $("#ConfirmPopupArea").modal('hide');
               alertPopup('We got some error, please try again later.', 'error');
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

function LoadMoreCommunicationTemplates(type) {
   var data = $('#FilterCommunicationManageTemplateForm').serializeArray();

//    $('#communication_templates_load_more_button').attr("disabled", "disabled");
//    $('#communication_templates_load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...');

   var pageNo = $('#pageJump').val(), rows = $('#rows').val();
   if (type == 'reset') {
       pageNo = 1;
       $('#pageJump').val(1);
       $('#load_more_results').html("");
//        $('#load_more_button').hide();
   }
   $.ajax({
       url: jsVars.templateLoadMoreUrl,
       type: 'post',
       dataType: 'html',
       //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
       data: {
           data: data,
           page: pageNo,
           rows: rows,
       },
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       beforeSend: function () {
           $('#listloader').show();
       },
       complete: function () {
            $('#listloader').hide();
       },
       success: function (data) {
           if (data == "error") {
               $('#load_more_results_template').html("<tr><td colspan='8' class='fw-500 relative text-danger text-center'>No More Records</td></tr>");
           } else {
               $('#load_more_results_template').html(data);
               if(pageNo == 1 &&  typeof maxPage != 'undefined') {
                   $('#maxPage').html(maxPage);
                   if(maxPage == 1) {
                       $('.prev, .next').removeClass('disabled').addClass('disabled');
                   } else {
                       $('.next, .prev').removeClass('disabled');
                       $('.prev').addClass('disabled');
                   }
               } else if(typeof maxPage != 'undefined' && pageNo == maxPage) {
                   $('.prev, .next').removeClass('disabled');
                   $('.next').addClass('disabled');
               } else {
                   $('.prev, .next').removeClass('disabled');
               }
               dropdownMenuPlacement();
               if($('#select_all').is(':checked')==true){
                   selectAllAvailableRecords(rows);
               }
               $('[data-toggle="tooltip"]').tooltip();
//                $('#communication_templates_load_more_button').removeAttr("disabled");
//                $('#communication_templates_load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Template');
           }
           //console.log(data);
       },
       error: function (xhr, ajaxOptions, thrownError) {
           //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

$('#pageJump').bind('keypress', function(e) {
   if ((e.which >= 48 && e.which <= 57) ||
       e.which === 8 || //Backspace key
       e.which === 13   //Enter key
       ) {
   } else {
     e.preventDefault();
   }
});
$('#pageJump').on("paste",function(e) {
   e.preventDefault();
});

$(document).on('change', '#pageJump', function() {
   if($('#pageJump').val() == '' || $('#pageJump').val().match(/^\d+$/) == null) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   } else if(parseInt($('#pageJump').val()) < 1 || parseInt($('#pageJump').val()) > parseInt($('#maxPage').html())) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   }
   LoadMoreCommunicationTemplates('');
});

$(document).on('change', '#rows', function() {
   $('#pageJump').val('1');
   LoadMoreCommunicationTemplates('');
});

$(document).on('click', '.prev', function(event) {
   if($('#pageJump').val().match(/^\d+$/) == null || parseInt($('#pageJump').val()) < 2) {
       event.preventDefault();
       return false;
   } else if(parseInt($('#pageJump').val()) < 2 || parseInt($('#pageJump').val()) > parseInt($('#maxPage').html())) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   }
   var updatePageValue = parseInt($('#pageJump').val()) - 1;
   if(updatePageValue < 2) {
       $(this).addClass('disabled');
       $('.next').removeClass('disabled');
   }
   $('#pageJump').val(updatePageValue);
   LoadMoreCommunicationTemplates('');
});

$(document).on('click', '.next', function(event) {
   if($('#pageJump').val().match(/^\d+$/) == null || parseInt($('#pageJump').val()) >= parseInt($('#maxPage').html())) {
//        alertPopup('Something went wrong', 'error');
       event.preventDefault();
       return false;
   } else if(parseInt($('#pageJump').val()) < 1) {
       alertPopup('Invalid Page Number', 'error');
       return false;
   }
   var updatePageValue = parseInt($('#pageJump').val()) + 1;
   if(updatePageValue >= $('#maxPage').html()) {
       $(this).addClass('disabled');
       $('.prev').removeClass('disabled');
   }
   $('#pageJump').val(updatePageValue);
   LoadMoreCommunicationTemplates('');
});

function alertPopup(msg, type, location) {
   if (type == 'error') {
       var selector_parent = '#ErrorPopupArea';
       var selector_titleID = '#ErroralertTitle';
       var selector_msg = '#ErrorMsgBody';
       var btn = '#ErrorOkBtn';
       var title_msg = 'Error';
   } else if (type == 'alert') {
       var selector_parent = '#ErrorPopupArea';
       var selector_titleID = '#ErroralertTitle';
       var selector_msg = '#ErrorMsgBody';
       var btn = '#ErrorOkBtn';
       var title_msg = 'Alert';
   }else {
       var selector_parent = '#SuccessPopupArea';
       var selector_titleID = '#alertTitle';
       var selector_msg = '#MsgBody';
       var btn = '#OkBtn';
       var title_msg = 'Success';
   }


   $(selector_titleID).html(title_msg);
   $(selector_parent+" "+selector_msg).html(msg);
   $('.oktick').hide();

   if (typeof location != 'undefined') {
       $(btn).show();

       $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
           e.preventDefault();
           if(location=='reload'){
               window.location.reload(true);
           }
           else{
               window.location.href = location;
           }

       });
   } else {
       $(selector_parent).modal();
   }
}

// function: Get All Forms of a College
function GetAllRelatedForms(CollegeId, Condition,sel_val) {
   if (CollegeId && Condition) {
       $.ajax({
           url: jsVars.GetAllRelatedFormUrl,
           type: 'post',
           data: {CollegeId: CollegeId, Condition: Condition},
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
               else if (json['success'] == 200) {

                   if(typeof(sel_val)==='undefined'){
                       var selected_val='';
                   }else{
                       var selected_val=sel_val;
                   }
                   var dp_sel_val='';
                   var html = "<option value=''>Select Form(s)</option>";
                   for (var key in json["FormList"]) {
                       if($.trim(selected_val)!='' && selected_val==key){
                           dp_sel_val='selected="selected"';
                       }else{
                           dp_sel_val='';
                       }
                       html += "<option value='" + key + "' "+dp_sel_val+">" + json["FormList"][key] + "</option>";
                   }

                   //alert(html);
                   $('#FormIdSelect').html(html);
                   $('#FormIdSelect').trigger('chosen:updated');
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
function GetCollegeAssociatedUserList(CollegeId,defaultval=true) {
   if (CollegeId) {

       //set in create template function on controller
       var defaulUserAccess = 0;
       if (typeof jsVars.defaulUserAccess !== 'undefined') {
           defaulUserAccess = 1;
       }

       $.ajax({
           url: jsVars.GetCollegeAssociatedUsersUrl,
           type: 'post',
           data: {CollegeId: CollegeId, defaulUserAccess : defaulUserAccess},
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
               else if (json['success'] == 200) {
                   var html = "";
                   for (var key in json["UsersList"]) {
                       html += "<option value='" + key + "'>" + json["UsersList"][key] + "</option>";
                   }

                   $('#UserAccessListSelect').html(html);
                   if (typeof json["defaulUserAccess"] !== 'undefined' && defaultval==true) {
                       $('#UserAccessListSelect').val(json["defaulUserAccess"]);
                   }
                   $('#UserAccessListSelect').trigger('chosen:updated');
                   $("#UserAccessListSelect")[0].sumo.reload();
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
function GetCollegeNFormMachineKeyList(CollegeId, FormId) {
   if (CollegeId) {

       //Get Template Applicable For
       var templateApplicableFor = '';
       if($('#TemplateCreationForm #applicableSelect').length && $('#TemplateCreationForm #applicableSelect').val() != '') {
           templateApplicableFor = $('#TemplateCreationForm #applicableSelect').val();
       }

       if(jsVars.isEdit!='undefined' && jsVars.isEdit == true &&  $('#applicable-for-read-only').length>0 &&  $('#applicable-for-read-only').val() != null && typeof $('#applicable-for-read-only').val() != 'undefined'){
           templateApplicableFor = $('#applicable-for-read-only').attr('data-value').trim().toLowerCase();
       }

       $.ajax({
           url: jsVars.GetCollegeAndFormAssociatedFieldsUrl,
           type: 'post',
           data: {CollegeId: CollegeId, FormId: FormId, templateApplicableFor: templateApplicableFor},
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
               else if (json['success'] == 200) {
//                    if (typeof(CKEDITOR) != "undefined"){
//                        for(name in CKEDITOR.instances){
//                            CKEDITOR.instances[name].destroy()
//                        }
//                    }
//                    initCKEditor($.parseJSON(json['CKEditorToken']));
                   var commonFields = json['CommonFields'];
                   commonFields = commonFields.replace('<option value="">--select--</option>','');
                   commonFields = '<option value=""></option><optgroup label="Tokens">'+commonFields;
                   $('#SMSMappingSeletct').html(commonFields).trigger('chosen:updated');                   
                   $('#WhatsAppMappingSelect').html(commonFields).trigger('chosen:updated');
                   $('#EmailMappingSeletct').html(commonFields).trigger('chosen:updated');
                   $('#EmailMappingSeletct').trigger('chosen:updated');                                      
                   if ($('#NotificationMappingSeletct').length > 0) {
                       $('#NotificationMappingSeletct').html(commonFields).trigger('chosen:updated');
                   }
                   if ($('#WhatsAppBusinessMappingSelect').length > 0 || $('#WhatsAppMappingSelect').length > 0) {

                       if(typeof json['staticTokens'] !== 'undefined' && json['staticTokens']!==''){
                           commonFields += '<optgroup label="Static Tokens">';
                           jQuery.each(json['staticTokens'], function (index, value) {
                               commonFields+= '<option value="'+index+'">'+value+'</option>';
                           });
                       }
                       $("#WhatsAppBusinessMappingSelect").html(commonFields);
                       $("#WhatsAppBusinessMappingSelect").trigger("chosen:updated");
                   }
                   popTokenList(commonFields);
               }
           },
           error: function (xhr, ajaxOptions, thrownError) {
               console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
               $('div.loader-block').hide();
           }
       });
   }
}

function GetCollegeNApplicableForList(CollegeId,container) {
   if (CollegeId) {
       $.ajax({
           url: '/communications/getTemplateApplicableFor',
           type: 'post',
           data: {CollegeId: CollegeId},
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
                   var html = "";
                   html +='<option value=""></option>';
                   for (var key in json["template_applicable_for_list"]) {
                       html += "<option value='" + key + "'>" + json["template_applicable_for_list"][key] + "</option>";
                   }

                   $('#'+container).html(html);
                   $('#'+container).trigger('chosen:updated');
               }
           },
           error: function (xhr, ajaxOptions, thrownError) {
               console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
               $('div.loader-block').hide();
           }
       });
   }
}

// function: Delete Email Attachment Uploaded File
function DeleteEmailAttachmentFile(FileId,LiContainer) {
    var template_id = 0;
    if(typeof $('#template_id').val()!="undefined" && $('#template_id').val()!=''){
        template_id = $('#template_id').val();
    }

   if (FileId) {
       $.ajax({
           url: '/communications/deleteEmailAttachmentFile',
           type: 'post',
           data: {FileId: FileId,template_id:template_id},
           dataType: 'json',
           headers: {
               "X-CSRF-Token": jsVars._csrfToken
           },
           success: function (json){
               if (json['redirect'])
                   location = json['redirect'];
               else if (json['error'])
                   alertPopup(json['error'], 'error');
               else if (json['success'] == 200) {
                   $('#'+LiContainer+' #li_'+FileId).remove();
                   $('#'+LiContainer+'List #li_'+FileId).remove();
                   $('#UploadFileInfoContainer'+' #li_'+FileId).remove();

                   if($(".whatsapp-delete").length > 0) {
                       $('.whatsapp-delete').remove();
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

//// function: Delete Email Attachment Uploaded File
//function DeleteEmailAttachmentFile(FileId,LiContainer) {
//    if (FileId) {
//        $.ajax({
//            url: jsVars.DeleteEmailAttachmentFileUrl,
//            type: 'post',
//            data: {FileId: FileId},
//            dataType: 'json',
//            headers: {
//                "X-CSRF-Token": jsVars._csrfToken
//            },
//            success: function (json)
//            {
//                if (json['redirect'])
//                    location = json['redirect'];
//                else if (json['error'])
//                    alertPopup(json['error'], 'error');
//                else if (json['success'] == 200) {
//                    $('#'+LiContainer+' #li_'+FileId).remove();
//                }
//            },
//            error: function (xhr, ajaxOptions, thrownError) {
//                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//                $('div.loader-block').hide();
//            }
//        });
//    }
//}

function initCKEditor(tokens){

   if(typeof CKEDITOR == 'undefined')
   {
       window.setTimeout(function(){
           initCKEditor(tokens);
       }, 500);
       return;
   }

   var newToken = [];
   jQuery.each(tokens, function (index, category) {
       if(category !== ''){
           jQuery.each(category, function (index, value) {
               value = $.parseJSON(value);
               newToken.push(value);
           });
       }
   });

   //$('#CommunicationBulkAction div.loader-block').show();
   if(typeof tokens =='undefined' || tokens == ''){
       tokens = [["", ""]];
   }
   if(typeof newToken =='undefined' || newToken == ''){
       newToken = [["", ""]];
   }

   var old_data = '';
   if(typeof CKEDITOR.instances['editor'] != 'undefined'){
       var old_data = CKEDITOR.instances['editor'].getData();
       delete CKEDITOR.instances['editor'];
       jQuery('#cke_editor').remove();
   }

   if(typeof fullPageCkEditorHtml != 'undefined' && fullPageCkEditorHtml === true) {
       fullPageCk = true;
       allowedContent = true;
   } else {
       fullPageCk = false;
       allowedContent = false;
   }

//CKEDITOR.instances['editor'] = null;

   CKEDITOR.replace( 'editor',{
       fullPage: fullPageCk,
       allowedContent: allowedContent,
       extraPlugins: 'token,justify',
//        availableTokens: [
//            ["", ""],
//            ["token1"+Math.floor((Math.random() * 100) + 1), "token1"],
//            ["token2"+Math.floor((Math.random() * 100) + 1), "token2"],
//            ["token3"+Math.floor((Math.random() * 100) + 1), "token3"],
//        ],
       allTokens: tokens,
       availableTokens: newToken,

           tokenStart: '{{',
           tokenEnd: '}}',
           on: {
               instanceReady: function( evt ) {
                   $('div.loader-block').hide();
//                    alert('dddrr');
               },
               change: function( evt ) {
                    if($("#is_edit_template").length > 0) {
                        $("#is_edit_template").val(1);
                    }
               }
       }
   });

   if(old_data != ''){
       CKEDITOR.instances['editor'].setData(old_data);
   }
}


// Communication box


$(function () {
   //on Template Type Change
   $(document).on('change', 'select#PredefinedTemplateSelect', function () {
       var DefaultTemplate;
       if (this.value)
       {
           DefaultTemplate = this.value;
           getPreDefinedTemplateHtml(DefaultTemplate);
       } else
       {
           CKEDITOR.instances['editor'].setData('');
           //instead of $(textarea).val(result);
       }
   });

   //on Template Change
   $(document).on('change', 'select#TemplateListSelect', function () {
       var template_id;
       if($('#appUnlayerIframeDiv').length > 0) $('#appUnlayerIframeDiv').html('').hide();
       if($('#is_edit_template').length > 0) $('#is_edit_template').val('');
       if (this.value){
           template_id = this.value;
           if(template_id == 'ck' || template_id == 'unlayer') {
               $('.modalLoader').show();
               $('#UploadFileInfoContainer').html('');
               $('#subject').val('');
               if(template_id == 'ck') {
                   if(typeof CKEDITOR.instances['editor'] == 'undefined' && typeof ckEditorTokens != 'undefined')    initCKEditor(ckEditorTokens);
                   CKEDITOR.instances['editor'].setData('');
                   $('.editorFullScreen').hide();
                   $('#editor-container').hide();
                   window.setTimeout(function(){
                       CKEDITOR.instances['editor'].setReadOnly(false);
                   },500);
                   $('#subject').attr('readonly',false);
                   $('.ck-edit').removeClass('ck-edit-disable');
                   //$(".modal-content").animate({ scrollTop: $('#CommunicationBulkAction').height()}, 1000);
               } else {
                   if(typeof CKEDITOR != 'undefined' && typeof CKEDITOR.instances['editor'] != 'undefined')  removeCKEditor('editor');
                   $('#editor-container').show();
                   //$(".modal-content").animate({ scrollTop: $('#CommunicationBulkAction').height()}, 1000);
                   fullScreen();
                   if(typeof unlayer == 'undefined' || typeof unlayer.frame == 'undefined' || unlayer.frame == null) {
                       initUnlayerEditor(unlayerMergeTags);
                   } else {
                       unlayer.setMergeTags(unlayerMergeTags);
                       unlayer.loadBlank();
                   }
                   window.setTimeout(function(){
                       unlayer.hidePreview("desktop");
                   },500);
                   $('.unlayer-edit').removeClass('unlayer-edit-disable');
                   $('.editorFullScreen').show();
               }
               $('#subject').attr('readonly',false);
               $('.modalLoader').hide();
           } else {
               getTemplatedDetailsById(template_id);
           }
       } else{
           $('#UploadFileInfoContainer').html('');
           $('#subject').val('');
           if(typeof unlayer !== 'undefined' && typeof unlayer.frame !== 'undefined' && unlayer.frame != null) {
               unlayer.loadBlank();
           }
           $('#editor-container').hide();
           if(typeof CKEDITOR !='undefined' && typeof CKEDITOR.instances['editor'] !='undefined' ){
               CKEDITOR.instances['editor'].setData('');
               removeCKEditor('editor');
           }
           //instead of $(textarea).val(result);
       }
   });

   //on Template Change
   $(document).on('change', 'select#smsTemplateList', function () {
       var template_id;
       $('#multi_lang').prop('checked', false);
       if (this.value){
           template_id = this.value;
           getTemplatedDetailsById(template_id,'sms');
       } else{
           $('#SMSTextArea').val('');
           $('#editor').val('');
       $('#SMSTextArea_charCount').html('');
       }
   });

   $('html').on('click','#SMSTextArea',function(){
       $('#SMSTextArea').prop('readonly',false);
       $('#SMSMappingSeletct').prop('disabled',false);
       $("#SMSMappingSeletct").trigger("chosen:updated");
       if($('#smsTemplateList').val() == '' && createTemplate != 'undefined'){
           var createTemplateDisbaleFlag = false;
           if(!createTemplate){
               createTemplateDisbaleFlag = true;
           }
           $('#SMSTextArea').prop('readonly',createTemplateDisbaleFlag);
           $('#SMSMappingSeletct').prop('disabled',createTemplateDisbaleFlag);
           $("#SMSMappingSeletct").trigger("chosen:updated");
       }
       if($('#smsTemplateList').val() != '' && typeof editTemplate != 'undefined'){
           var editTemplateDisbaleFlag = false;
           if(!editTemplate){
               editTemplateDisbaleFlag = true;
           }
           $('#SMSTextArea').prop('readonly',editTemplateDisbaleFlag);
           $('#SMSMappingSeletct').prop('disabled',editTemplateDisbaleFlag);
           $("#SMSMappingSeletct").trigger("chosen:updated");
       }
   });

   $('html').on('click','#WhatsAppTextArea',function(){
       $('#WhatsAppTextArea').prop('readonly',false);
       $('#WhatsAppMappingSelect').prop('disabled',false);
       $("#WhatsAppMappingSelect").trigger("chosen:updated");
       if($('#whatsAppTemplateList').val() == '' && typeof createTemplate != 'undefined'){
           var createTemplateDisbaleFlag = false;
           if(!createTemplate){
               createTemplateDisbaleFlag = true;
           }
           $('#WhatsAppTextArea').prop('readonly',createTemplateDisbaleFlag);
           $('#WhatsAppMappingSelect').prop('disabled',createTemplateDisbaleFlag);
           $("#WhatsAppMappingSelect").trigger("chosen:updated");
       }
       if($('#whatsAppTemplateList').val() != '' && editTemplate != 'undefined'){
           var editTemplateDisbaleFlag = false;
           if(!editTemplate){
               editTemplateDisbaleFlag = true;
           }
           $('#WhatsAppTextArea').prop('readonly',editTemplateDisbaleFlag);
           $('#WhatsAppMappingSelect').prop('disabled',editTemplateDisbaleFlag);
           $("#WhatsAppMappingSelect").trigger("chosen:updated");
       }
   });

   $(document).on('change', 'select#whatsAppTemplateList', function () {
       var template_id;
       $('#UploadFileInfoContainer').html('');
       var whatsappType = $("#whatsappType").val();
       if (this.value){
           template_id = this.value;
           getTemplatedDetailsById(template_id,whatsappType);
       } else{
           $('#WhatsAppTextArea').val('');
           $('#editor').val('');

       }
   });

   $(document).on('submit', 'form#CommunicationEmail', function (e) {
       if ($('#EmailUpload').val()) {
           var $fileUpload = $("input[type='file'][name='EmailUpload[]']");
           if (parseInt($fileUpload.get(0).files.length) > JS_COMMUNICATION_TOTAL_FILES_UPLOAD_LIMIT){
               alertPopup('Sorry! You can upload maximum ' + JS_COMMUNICATION_TOTAL_FILES_UPLOAD_LIMIT + ' files.','error');
               return false;
           }
           e.preventDefault();
           if(!$('#editor-container').is(':hidden')) {
               unlayer.exportHtml(function(data) {
                   $('textarea#editor').val(data.html);
                   submitEmailUploadRequest();
               });
           } else {
               submitEmailUploadRequest();
           }
           $('div.loader-block').show();
           return false;
       }else{
           $('#dispsuccess').hide();
           $('#disperror').hide();
           $('#TemplateCreationSubmitBtn').attr('disabled','disabled');
           e.preventDefault();
           $('div.loader-block').show();
           if(!$('#editor-container').is(':hidden')) {
               unlayer.exportHtml(function(data) {
                   $('textarea#editor').val(data.html);
                   sendSingleCommEmailRequest();
               });
           } else {
               sendSingleCommEmailRequest();
           }
           return false;
       }
   });

   function submitEmailUploadRequest() {
       $('form#CommunicationEmail').ajaxSubmit({
           beforeSubmit: function () {
               $("#progress-bar").show();
               $("#progress-bar").width('0%');
           },
           uploadProgress: function (event, position, total, percentComplete) {

               $("#progress-bar").width(percentComplete + '%');
               $("#progress-bar").html('<div id="progress-status">' + percentComplete + ' %</div>')
           },
           success: function (data) {
               //console.log(data);
               $('#UploadFileInfoContainer').html(data);
               $('#EmailUpload').val('');
               $("#progress-bar").hide();
               $('div.loader-block').hide();
           },
           resetForm: false
       });
   }

   function sendSingleCommEmailRequest() {
       $('form#CommunicationEmail').ajaxSubmit({
           success: function (data) {
               if(data!='done'){
                   $('#dispsuccess').hide();
                   $('#disperror').show();
                   $('#dispsuccess').html('');
                   $('#disperror').html(data);
                   $('#to_email').trigger('chosen:updated');
                   $('#cc_email').trigger('chosen:updated');
                   $('#TemplateCreationSubmitBtn').removeAttr('disabled');
               }else{
                   $('#dispsuccess, div#single_communication_html #dispsuccess').show();
                   $('#disperror, div#single_communication_html #disperror').hide();
                   $('#disperror, div#single_communication_html #disperror').html('');
                   $('#cc_email').val('');
                   $('#subject').val('');
                   $('#TemplateListSelect').val('').trigger('chosen:updated');
                   if(typeof CKEDITOR.instances['editor'] != 'undefined'){
                       CKEDITOR.instances['editor'].setData('');
                   }
                   if(typeof unlayer.frame !== 'undefined' && unlayer.frame != null) {
                       unlayer.loadBlank();
                       unlayer.setMergeTags(unlayerMergeTags);
                   }
                   $('#UploadFileInfoContainer').html('');
                   $('#dispsuccess, div#single_communication_html #dispsuccess').html('Successfully Sent');
               }
               $('#donothing').focus();
               $('div.loader-block').hide();
           },
           resetForm: true
       });
   }


   // submit comment
   $(document).on('submit', 'form#CommunicationComment', function (e) {
       $('#dispsuccess').hide();
       $('#disperror').hide();

       e.preventDefault();
       $('div.loader-block').show();
       $('#commSubmitBtn').attr('disabled','disabled');
       $(this).ajaxSubmit({
           success: function (data) {
               //console.log(data);
               if(data!='done'){

                   $('#dispsuccess').hide();
                   $('#disperror').show();

                   $('#dispsuccess').html('');
                   $('#disperror').html(data);
                   $('#commSubmitBtn').removeAttr('disabled');
               }else{
                   $('#dispsuccess').show();
                   $('#disperror').hide();

                   $('#commSubmitBtn').html('<i class="fa fa-thumbs-up" aria-hidden="true"></i>&nbsp;Sent');
                   $('#disperror').html('');
                   $('#dispsuccess').html('Successfully Sent');
                   var user_id = $('#user_id').val();
                   var form_id = $('#form_id').val();
           var college_id = $('#college_id').val();
                   var ctype = $('#ctype').val();
                   communicationComment(user_id,form_id,ctype,college_id);
               }
               $('div.loader-block').hide();
           },
           resetForm: true
       });
       return false;

   });

   // submit comment
   $(document).on('submit', 'form#CommunicationSMS', function (e) {

       $('#dispsuccess, div#single_communication_html #dispsuccess').hide();
       $('#disperror, div#single_communication_html #disperror').hide();

       $('div.loader-block').show();
       $('#commSubmitBtn').attr('disabled','disabled');
       e.preventDefault();
       $(this).ajaxSubmit({
           success: function (data) {
               //console.log(data);
               if(data!='done'){

                   $('#dispsuccess, div#single_communication_html #dispsuccess').hide();
                   $('#disperror, div#single_communication_html #disperror').show();

                   $('#dispsuccess, div#single_communication_html #dispsuccess').html('');
                   $('#disperror, div#single_communication_html #disperror').html(data);
                   $('#commSubmitBtn').removeAttr('disabled');
               }else{

                   $('#dispsuccess, div#single_communication_html #dispsuccess').show();
                   $('#disperror, div#single_communication_html #disperror').hide();

                   $('#commSubmitBtn').html('Successfully Sent');
                   $('#disperror, div#single_communication_html #disperror').html('');
                   $('#dispsuccess, div#single_communication_html #dispsuccess').html('Successfully Sent');

                   //FInally reset the form after successfully sent SMS
                   $("form#CommunicationSMS")[0].reset();
               }
               $('div.loader-block').hide();
           },
           //resetForm: true
       });
       return false;

   });

   $(document).on('submit', 'form#CommunicationWhatsApp', function (e) {
       var whatsappType = $("#whatsappType").val();

       if(whatsappType === '' || whatsappType === null || whatsappType === 'undefined'){
           return false;
       }
       $('#dispsuccess, div#single_communication_html #dispsuccess').hide();
       $('#disperror, div#single_communication_html #disperror').hide();

       $('div.loader-block').show();
       $('#commSubmitBtn').attr('disabled','disabled');
       e.preventDefault();
       $(this).ajaxSubmit({
           success: function (data) {
               data = JSON.parse(data);
               if(data.success==true){

                   if(whatsappType === 'whatsapp'){
                       $('#dispsuccess, div#single_communication_html #dispsuccess').show();
                       $('#disperror, div#single_communication_html #disperror').hide();

                       $('#commSubmitBtn').html('Successfully Sent');
                       $('#disperror, div#single_communication_html #disperror').html('');
                       $('#dispsuccess, div#single_communication_html #dispsuccess').html('Refer to <a href="'+data.data+'" target="_blank" style="color:#0074d9;">web.whatsapp.com</a> to check message sent and received status.');

                       //FInally reset the form after successfully sent SMS
                       $("form#CommunicationWhatsApp")[0].reset();
                        //call for mobile app callback
                       if(typeof interface !== 'undefined' && data.data){
                           interface.whatsAppClickToCall(data.data.msg,data.data.mobile,data.data.dialCode);
                       }else if(typeof interface !== 'undefined' && data.msg){
                           interface.whatsAppClickToCall(data.msg);
                       }else if(getMobileOperatingSystem() == 'ios' && 
                               window.webkit && window.webkit.messageHandlers && 
                               window.webkit.messageHandlers.toggleMessageHandler){                            
                            window.webkit.messageHandlers.toggleMessageHandler.postMessage({
                                'message': data.data.msg, 'mobile': data.data.mobile, 'dialCode': data.data.dialCode
                            });     
                       }else{
                           var pagename = moment().format('x');
                           window.open(data.data,pagename,'resizable width=1200, height=600, scrollbars=yes, left=100, top=50');
                           $('#commCancelBtn').trigger('click');
                       }

                   }else if(whatsappType === 'whatsapp_business'){

                       $('#dispsuccess, div#single_communication_html #dispsuccess').show();
                       $('#disperror, div#single_communication_html #disperror').hide();
                       $('#disperror, div#single_communication_html #disperror').html('');

                       $("form#CommunicationWhatsApp")[0].reset();
                       $("#whatsAppTemplateList").val('').trigger("chosen:updated");
                       $('#dispsuccess, div#single_communication_html #dispsuccess').html('Successfully Sent');
                   }
               }else{
                   $('#dispsuccess, div#single_communication_html #dispsuccess').hide();
                   $('#disperror, div#single_communication_html #disperror').show();

                   $('#dispsuccess, div#single_communication_html #dispsuccess').html('');
                   $('#disperror, div#single_communication_html #disperror').html(data.data);
                   $('#commSubmitBtn').removeAttr('disabled');
               }
               $('div.loader-block').hide();
           },
           //resetForm: true
       });
       return false;

   });

   $(document).on('submit', 'form#CommunicationVsms', function (e) {
       var templateId = $('#vsmsTemplateListSelect').val();
       if (templateId == '') {

           $('#dispsuccess').hide();
           $('#disperror').show();

           $('#dispsuccess').html('');
           $('#disperror').html('Please select a template.');
           return false;
       }
       else {

           $('#dispsuccess').show();
           $('#disperror').hide();

           $('#bulkVsmsSendBtn').attr("disabled","disabled");
           e.preventDefault();
           $('div.loader-block').show();
           var FilterLeadFormData = $('#FilterLeadForm').formSerialize();
           sendBulkVsms(FilterLeadFormData, templateId);
       }
//        $('#bulkVsmsSendBtn').removeAttr("disabled");
       return false;
   });

   $(document).on('submit', 'form#BulkEmailCommunication', function (e) {

//        console.log($('#EmailUpload').val());
//        return false;
       if ($('#EmailUpload').val()) {
           var $fileUpload = $("input[type='file'][name='EmailUpload[]']");
           if (parseInt($fileUpload.get(0).files.length) > JS_COMMUNICATION_TOTAL_FILES_UPLOAD_LIMIT){
               alertPopup('Sorry! You can upload maximum ' + JS_COMMUNICATION_TOTAL_FILES_UPLOAD_LIMIT + ' files.','error');
               return false;
           }

           e.preventDefault();
           $('#CommunicationBulkAction div.loader-block').show();
           if(!$('#editor-container').is(':hidden')) {
               unlayer.exportHtml(function(data) {
                   $('textarea#editor').val(data.html);
                   $('form#BulkEmailCommunication').ajaxSubmit({
                       beforeSubmit: function () {
                           $("#progress-bar").show();
                           $("#progress-bar").width('0%');
                       },
                       uploadProgress: function (event, position, total, percentComplete) {

                           $("#progress-bar").width(percentComplete + '%');
                           $("#progress-bar").html('<div id="progress-status">' + percentComplete + ' %</div>')
                       },
                       success: function (data) {
                           //console.log(data);
                           $('#UploadFileInfoContainer').html(data);
                           $('#EmailUpload').val('');
                           $("#progress-bar").hide();
                           $('div.loader-block').hide();
                       },
                       resetForm: false
                   });
               });
           } else {
               $('form#BulkEmailCommunication').ajaxSubmit({
                   beforeSubmit: function () {
                       $("#progress-bar").show();
                       $("#progress-bar").width('0%');
                   },
                   uploadProgress: function (event, position, total, percentComplete) {

                       $("#progress-bar").width(percentComplete + '%');
                       $("#progress-bar").html('<div id="progress-status">' + percentComplete + ' %</div>')
                   },
                   success: function (data) {
                       //console.log(data);
                       $('#UploadFileInfoContainer').html(data);
                       $('#EmailUpload').val('');
                       $("#progress-bar").hide();
                       $('div.loader-block').hide();
                   },
                   resetForm: false
               });
           }
           return false;
       }else{

           $('#disperror').hide();
           $('#dispsuccess').hide();

           e.preventDefault();
           $('div.loader-block').show();
           $('#TemplateCreationSubmitBtn1').attr('disabled','disabled');
           $('.modalLoader, #listloader').show();
           $('.modalLoader').css('position', 'fixed');
           // merge two form data
           //var applications = $("#ctype").val();

                   //mktg_leads


           if($("#ctype").length>0 && $("#ctype").val() == 'applications'){ //for application LMS
               var alldata = $('#BulkEmailCommunication, #FilterApplicationForms').serializeArray();
           }
           else if($("#ctype").length>0 && $("#ctype").val() == 'mktg_leads'){ //for lists
               var alldata = $('#BulkEmailCommunication, #manageContacts').serializeArray();
           }
           else if($("#ctype").length>0 && $("#ctype").val() == 'mktg_segments'){ //for segments
               var alldata = $('#BulkEmailCommunication, #manageContacts').serializeArray();
           }
           else if(($("#ctype").length > 0) && (($("#ctype").val() == 'mktg_leads_list') ||
               ($("#ctype").val() == 'leads_list') || ($("#ctype").val() == 'applications_list'))){ //for leads
               var alldata = $('#BulkEmailCommunication, #listManager').serializeArray();
           }
           else if(($("#ctype").length > 0) && (($("#ctype").val() == 'mktg_segments_list') ||
               ($("#ctype").val() == 'leads_segments') || ($("#ctype").val() == 'applications_segments'))){ //for segments List
               var alldata = $('#BulkEmailCommunication, #segmentManager').serializeArray();
           }else if($("#ctype").length>0 && ($("#ctype").val() == 'examComm')){ //for Exam
               var alldata = $('#BulkEmailCommunication, #ExamForm').serializeArray();
           }else if($("#ctype").length>0 && $("#ctype").val() == 'assessment_score'){ //for Assessment score
               var arr = $('.select_users:checked').map(function(){
                   return this.value;
               }).get();

               var alldata = $('#BulkEmailCommunication, #assessmentListingFormMain').serializeArray();
               alldata.push({name: "selected_users", value: arr});
           }else {
               var alldata = $('#BulkEmailCommunication, #FilterLeadForm').serializeArray();
           }
           //$('#TemplateCreationSubmitBtn1').attr('disabled','disabled');
           if($('#appUnlayerIframeDiv').length > 0  && !$('#appUnlayerIframeDiv').is(':hidden')) {
               $.each(alldata, function() {
                   if(this.name == 'message_text') {
                       this.value = unlayerTemplateText;
                   }
               });
               sendBulkCommunicationRequest(alldata);
           } else if(!$('#editor-container').is(':hidden')) {
               unlayer.exportHtml(function(data) {
                   $.each(alldata, function() {
                       if(this.name == 'message_text') {
                           this.value = data.html;
                       }
                   });
                   sendBulkCommunicationRequest(alldata);
               });
           } else {
               sendBulkCommunicationRequest(alldata);
           }
           return false;
       }
   });

   function sendBulkCommunicationRequest(alldata) {
       $.ajax({
           url: '/communications/bulk-email-communication-save',
           type: 'post',
           dataType: 'json',
           data: alldata,
           headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
           beforeSend: function () {
                   $('.modalLoader, #listloader').show();
                   $('.modalLoader').css('position', 'fixed');
           },
           complete: function () {
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
           },
           success: function (obj) {
               if (obj.status == 200) {
                   if($('#isCD').length > 0) {
                      $('#isCD').val('0');
                   }
                   $('#TemplateCreationSubmitBtn1').html('Sent');
                   $('#disperror').html('');
                   $('#disperror').hide();
                   $('#dispsuccess').show();
                   $('#dispsuccess').html('Communication Request for EMAIL saved successfully.');
                   $(".modal-content").animate({ scrollTop: 0}, 1000);
                   //call for mobile app callback
                    if (typeof interface != 'undefined') {
                        interface.callFromJS('email');
                    } else if (getMobileOperatingSystem() == 'ios') {
                        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.toggleMessageHandler) {
                            window.webkit.messageHandlers.toggleMessageHandler.postMessage({
                                "message": 'email'
                            });
                        }
                    }
               }else if(typeof obj.errors != 'undefined' && obj.errors!=''){
                   $(".modal-content").animate({ scrollTop: 0}, 1000);
                   $('#dispsuccess').html('');
                   $('#disperror').show();
                   $('#dispsuccess').hide();
                   $('#disperror').html(obj.errors);
                   $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
               }else if (typeof obj.totalUserToBeCommunicateMessage != 'undefined' && obj.totalUserToBeCommunicateMessage != '') {
                   $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
                   $("#confirmYes").removeAttr('onclick');
                   $('#confirmTitle').html("Confirm");
                   $("#confirmYes").html('Ok');
                   $("#confirmYes").siblings('button').html('Cancel');
                   $('#ConfirmMsgBody').html(obj.totalUserToBeCommunicateMessage);
                   $('#ConfirmPopupArea').css('z-index', '11111');

                   $('#totalUserCount').val(obj.totalUserCount);

                   $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                       .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                       e.preventDefault();
                       if($('#isCD').length > 0) {
                           $('#isCD').val('1');
                           $('form#BulkEmailCommunication').submit();
                           $('#ConfirmPopupArea').modal('hide');
                           $('#ConfirmPopupArea').css('z-index', '11111');
                       }
                   });
               }else if(typeof obj.communicationMessageCheck != 'undefined' && obj.communicationMessageCheck != ''){
                   $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
                   $("#confirmYes").removeAttr('onclick');
                   $('#confirmTitle').html("Confirm");
                   $("#confirmYes").html('Ok');
                   $("#confirmYes").siblings('button').remove();
                   $('#ConfirmMsgBody').html(obj.communicationMessageCheck);
                   $('#ConfirmPopupArea').css('z-index', '11111');

                   $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                       .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                       e.preventDefault();
                       if($('#isCD').length > 0) {
                           window.location.href='';
                       }
                   });
               }
               else{
                   $(".modal-content").animate({ scrollTop: 0}, 1000);
                   $('#disperror').show();
                   $('#dispsuccess').hide();
                   $('#dispsuccess').html('');
                   $('#disperror').html('Some Error in sending EMAIL, please try again later.');
                   $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
               }
               $('div.loader-block').hide();
               $('#donothing').focus();
           },
           error: function (xhr, ajaxOptions, thrownError) {
               //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
               console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           }
       });
   }

   $(document).on('submit', 'form#bulkSmsCommunication', function (e) {

       $('#dispsuccess').hide();
       $('#disperror').hide();

       e.preventDefault();
       $('div.loader-block').show();
       $('#commSubmitBtn').attr('disabled','disabled');
       $('.modalLoader, #listloader').show();
       $('.modalLoader').css('position', 'fixed');

       // merge two form data
       //var alldata = $('#bulkSmsCommunication, #FilterLeadForm').serializeArray();
       //mktg_leads
       if($("#ctype").length>0 && $("#ctype").val() == 'applications'){ //for application LMS
           var alldata = $('#bulkSmsCommunication, #FilterApplicationForms').serializeArray();
       }else if($("#ctype").length>0 && $("#ctype").val() == 'mktg_leads'){ //for application LMS
           var alldata = $('#bulkSmsCommunication, #manageContacts').serializeArray();
       }else if($("#ctype").length>0 && $("#ctype").val() == 'mktg_segments'){ //for segments
           var alldata = $('#bulkSmsCommunication, #manageContacts').serializeArray();
       }else if(($("#ctype").length > 0) && (($("#ctype").val() == 'mktg_leads_list') ||
               ($("#ctype").val() == 'leads_list') || ($("#ctype").val() == 'applications_list'))){ //for leads
           var alldata = $('#listManager, #bulkSmsCommunication').serializeArray();
       }else if(($("#ctype").length > 0) && (($("#ctype").val() == 'mktg_segments_list') ||
               ($("#ctype").val() == 'leads_segments') || ($("#ctype").val() == 'applications_segments'))){ //for segments List
           var alldata = $('#segmentManager, #bulkSmsCommunication ').serializeArray();
       }else if($("#ctype").length>0 && ($("#ctype").val() == 'examComm')){ //for Exam
               var alldata = $('#bulkSmsCommunication, #ExamForm').serializeArray();
       }else if($("#ctype").length>0 && $("#ctype").val() == 'assessment_score'){ //for segments
           var alldata = $('#bulkSmsCommunication, #assessmentListingFormMain').serializeArray();
           var arr = $('.select_users:checked').map(function(){
               return this.value;
           }).get();
           alldata.push({name: "selected_users", value: arr});
       } else {
           var alldata = $('#bulkSmsCommunication, #FilterLeadForm').serializeArray();
       }

       $.ajax({
           url: '/communications/bulk-sms-communication-save',
           type: 'post',
           dataType: 'json',
           data: alldata,
           headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
           beforeSend: function () {
               $('.modalLoader, #listloader').show();
               $('.modalLoader').css('position', 'fixed');
           },
           complete: function () {
               $('.modalLoader, #listloader').hide();
               $('.modalLoader').css('position', 'absolute');
           },
           success: function (obj) {
               if (obj.status == 200) {
                   if($('#isCD').length > 0) {
                      $('#isCD').val('0');
                   }
                   $('#dispsuccess').show();
                   $('#disperror').hide();
                   $('#commSubmitBtn').html('Sent');
                   $('#disperror').html('');
                   $('#dispsuccess').html('Communication Request for SMS saved successfully.');
                   $(".modal-content").animate({ scrollTop: 0}, 1000);
                   //call for mobile app callback
                    if (typeof interface != 'undefined') {
                        interface.callFromJS('sms');
                    } else if (getMobileOperatingSystem() == 'ios') {
                        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.toggleMessageHandler) {
                            window.webkit.messageHandlers.toggleMessageHandler.postMessage({
                                "message": 'sms'
                            });
                        }
                    }

               }else if(typeof obj.errors != 'undefined' && obj.errors!=''){
                   $('#dispsuccess').hide();
                   $('#disperror').show();
                   $('#dispsuccess').html('');
                   $('#disperror').html(obj.errors);
                   $('#commSubmitBtn').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
                   $(".modal-content").animate({ scrollTop: 0}, 1000);
               }else if (typeof obj.totalUserToBeCommunicateMessage != 'undefined' && obj.totalUserToBeCommunicateMessage != '') {
                   $('#commSubmitBtn').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
                   $("#confirmYes").removeAttr('onclick');
                   $('#confirmTitle').html("Confirm");
                   $("#confirmYes").html('Ok');
                   $("#confirmYes").siblings('button').html('Cancel');
                   $('#ConfirmMsgBody').html(obj.totalUserToBeCommunicateMessage);

                   $('#totalUserCount').val(obj.totalUserCount);

                   $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                       .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                       e.preventDefault();

                       if($('#isCD').length > 0) {
                           $('#isCD').val('1');
                           $('form#bulkSmsCommunication').submit();
                           $('#ConfirmPopupArea').modal('hide');
                       }
                   });
               }else if(typeof obj.communicationMessageCheck != 'undefined' && obj.communicationMessageCheck != ''){
                       $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
           $('.modalLoader, #listloader').hide();
           $('.modalLoader').css('position', 'absolute');
                       $("#confirmYes").removeAttr('onclick');
                       $('#confirmTitle').html("Confirm");
                       $("#confirmYes").html('Ok');
                       $("#confirmYes").siblings('button').remove();
                       $('#ConfirmMsgBody').html(obj.communicationMessageCheck);
           $('#ConfirmPopupArea').css('z-index', '11111');

                       $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                           .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                           e.preventDefault();
                           if($('#isCD').length > 0) {
                               window.location.href='';
                           }
                       });
               }else{
                   $('#dispsuccess').hide();
                   $('#disperror').show();
                   $('#dispsuccess').html('');
                   $('#disperror').html('Some Error in sending SMS, please try again later.');
                   $('#commSubmitBtn').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
                   $(".modal-content").animate({ scrollTop: 0}, 1000);
               }
               $('#donothing').focus();
               $('div.loader-block').hide();
           },
           error: function (xhr, ajaxOptions, thrownError) {
               //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
               console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           }
       });
       return false;
   })

   //Notification form submit
   $(document).on('submit', 'form#communicationNotification', function (e) {

       $('#dispsuccess, div#single_communication_html #dispsuccess').hide();
       $('#disperror, div#single_communication_html #disperror').hide();

       $('div.loader-block').show();
       $('#commSubmitBtn').attr('disabled','disabled');
       $('.modalLoader, #listloader').show();
       $('.modalLoader').css('position', 'fixed');
       e.preventDefault();
       $(this).ajaxSubmit({
           success: function (data) {
               //console.log(data);
               if(data!='done'){

                   $('#dispsuccess, div#single_communication_html #dispsuccess').hide();
                   $('#disperror, div#single_communication_html #disperror').show();

                   $('#dispsuccess, div#single_communication_html #dispsuccess').html('');
                   $('#disperror, div#single_communication_html #disperror').html(data);
                   $('#commSubmitBtn').removeAttr('disabled');
                   $('.modalLoader #listloader').hide();
               }else{

                   $('#dispsuccess, div#single_communication_html #dispsuccess').show();
                   $('#disperror, div#single_communication_html #disperror').hide();

                   $('#commSubmitBtn').html('Successfully Sent');
                   $('#disperror, div#single_communication_html #disperror').html('');
                   $('#dispsuccess, div#single_communication_html #dispsuccess').html('Successfully Sent');

                   //FInally reset the form after successfully sent SMS
                   $("form#communicationNotification")[0].reset();
               }
               $('div.loader-block').hide();
           },
           //resetForm: true
       });
       return false;

   });

   $(document).on('submit', 'form#bulkNotificationCommunication', function (e) {

       $('#dispsuccess').hide();
       $('#disperror').hide();

       e.preventDefault();
       $('div.loader-block').show();
       $('#commSubmitBtn').attr('disabled','disabled');
       $('.modalLoader, #listloader').show();
       $('.modalLoader').css('position', 'fixed');
       // merge two form data
       if($("#ctype").length>0 && $("#ctype").val() == 'applications'){ //for application only
           var alldata = $('#bulkNotificationCommunication, #FilterApplicationForms').serializeArray();
       }

       $.ajax({
           url: '/communications/bulk-notification-communication-save',
           type: 'post',
           dataType: 'json',
           data: alldata,
           headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
           beforeSend: function () {
               $('.modalLoader, #listloader').show();
               $('.modalLoader').css('position', 'fixed');
           },
           complete: function () {
               $('.modalLoader, #listloader').hide();
               $('.modalLoader').css('position', 'absolute');
           },
           success: function (obj) {
               if (obj.status == 200) {
                   if($('#isCD').length > 0) {
                      $('#isCD').val('0');
                   }

                   $('#dispsuccess').show();
                   $('#disperror').hide();

                   $('#commSubmitBtn').html('Sent');
                   $('#disperror').html('');
                   $('#dispsuccess').html('Communication Request for Notification saved successfully.');
               }else if(typeof obj.errors != 'undefined' && obj.errors!=''){

                   $('#dispsuccess').hide();
                   $('#disperror').show();

                   $('#dispsuccess').html('');
                   $('#disperror').html(obj.errors);
                   $('#commSubmitBtn').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
               }else if (typeof obj.totalUserToBeCommunicateMessage != 'undefined' && obj.totalUserToBeCommunicateMessage != '') {
                   $('#commSubmitBtn').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
                   $("#confirmYes").removeAttr('onclick');
                   $('#confirmTitle').html("Confirm");
                   $("#confirmYes").html('Ok');
                   $("#confirmYes").siblings('button').html('Cancel');
                   $('#totalUserCount').val(obj.totalUserCount);
                   $('#ConfirmMsgBody').html(obj.totalUserToBeCommunicateMessage);
                   $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                       .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                       e.preventDefault();

                       if($('#isCD').length > 0) {
                           $('#isCD').val('1');
                           $('form#bulkNotificationCommunication').submit();
                           $('#ConfirmPopupArea').modal('hide');
                       }
                   });
               }else if(typeof obj.communicationMessageCheck != 'undefined' && obj.communicationMessageCheck != ''){
                       $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
           $('.modalLoader, #listloader').hide();
           $('.modalLoader').css('position', 'absolute');
                       $("#confirmYes").removeAttr('onclick');
                       $('#confirmTitle').html("Confirm");
                       $("#confirmYes").html('Ok');
                       $("#confirmYes").siblings('button').remove();
                       $('#ConfirmMsgBody').html(obj.communicationMessageCheck);
           $('#ConfirmPopupArea').css('z-index', '11111');

                       $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                           .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                           e.preventDefault();
                           if($('#isCD').length > 0) {
                               window.location.href='';
                           }
                       });
               }else{

                   $('#dispsuccess').hide();
                   $('#disperror').show();
                   $('#dispsuccess').html('');
                   $('#disperror').html('Some Error in sending Notification, please try again later.');
                   $('#commSubmitBtn').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
               }
               $('#donothing').focus();
               $('div.loader-block').hide();
           },
           error: function (xhr, ajaxOptions, thrownError) {
               //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
               console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           }
       });
       return false;
   })

   $(document).on('submit', 'form#bulkWhatsappCommunication', function (e) {

       $('#dispsuccess').hide();
       $('#disperror').hide();

       e.preventDefault();
       $('div.loader-block').show();
       $('#commSubmitBtn').attr('disabled','disabled');
       $('.modalLoader, #listloader').show();
       $('.modalLoader').css('position', 'fixed');

       // merge two form data
       //var alldata = $('#bulkSmsCommunication, #FilterLeadForm').serializeArray();
       //mktg_leads
       if($("#ctype").length>0 && $("#ctype").val() === 'applications'){ //for application LMS
           var alldata = $('#bulkWhatsappCommunication, #FilterApplicationForms').serializeArray();
       }else if($("#ctype").length>0 && $("#ctype").val() === 'mktg_leads'){ //for application LMS
           var alldata = $('#bulkWhatsappCommunication, #manageContacts').serializeArray();
       }else if($("#ctype").length>0 && $("#ctype").val() === 'mktg_segments'){ //for segments
           var alldata = $('#bulkWhatsappCommunication, #manageContacts').serializeArray();
       }else if(($("#ctype").length > 0) && (($("#ctype").val() === 'mktg_leads_list') ||
               ($("#ctype").val() === 'leads_list') || ($("#ctype").val() === 'applications_list'))){ //for leads
           var alldata = $('#listManager, #bulkWhatsappCommunication').serializeArray();
       }else if(($("#ctype").length > 0) && (($("#ctype").val() === 'mktg_segments_list') ||
               ($("#ctype").val() === 'leads_segments') || ($("#ctype").val() === 'applications_segments'))){ //for segments List
           var alldata = $('#segmentManager, #bulkWhatsappCommunication ').serializeArray();
       }else if($("#ctype").length>0 && ($("#ctype").val() === 'examComm')){ //for Exam
               var alldata = $('#bulkWhatsappCommunication, #ExamForm').serializeArray();
       }else if($("#ctype").length>0 && ($("#ctype").val() === 'assessment_score')){ //for Exam
               var alldata = $('#bulkWhatsappCommunication, #assessmentListingFormMain').serializeArray();
       } else {
           var alldata = $('#bulkWhatsappCommunication, #FilterLeadForm').serializeArray();
       }

       $.ajax({
           url: '/communications/bulk-whatsapp-communication-save',
           type: 'post',
           dataType: 'json',
           data: alldata,
           headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
           beforeSend: function () {
               $('.modalLoader, #listloader').show();
               $('.modalLoader').css('position', 'fixed');
           },
           complete: function () {
               $('.modalLoader, #listloader').hide();
               $('.modalLoader').css('position', 'absolute');
           },
           success: function (obj) {
               if (obj.status == 200) {
                   if($('#isCD').length > 0) {
                      $('#isCD').val('0');
                   }
                   $('#dispsuccess').show();
                   $('#disperror').hide();
                   $('#commSubmitBtn').html('Sent');
                   $('#disperror').html('');
                   $('#dispsuccess').html('Communication Request for Whatsapp saved successfully.');
                   $(".modal-content").animate({ scrollTop: 0}, 1000);
                   //call for mobile app callback
                    if (typeof interface != 'undefined') {
                        interface.callFromJS('whatsapp');
                    } else if (getMobileOperatingSystem() == 'ios') {
                        if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.toggleMessageHandler) {
                            window.webkit.messageHandlers.toggleMessageHandler.postMessage({
                                "message": 'whatsapp'
                            });
                        }
                    }

               }else if(typeof obj.errors != 'undefined' && obj.errors!=''){
                   $('#dispsuccess').hide();
                   $('#disperror').show();
                   $('#dispsuccess').html('');
                   $('#disperror').html(obj.errors);
                   $('#commSubmitBtn').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
                   $(".modal-content").animate({ scrollTop: 0}, 1000);
               }else if (typeof obj.totalUserToBeCommunicateMessage != 'undefined' && obj.totalUserToBeCommunicateMessage != '') {
                   $('#commSubmitBtn').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
                   $("#confirmYes").removeAttr('onclick');
                   $('#confirmTitle').html("Confirm");
                   $("#confirmYes").html('Ok');
                   $("#confirmYes").siblings('button').html('Cancel');
                   $('#ConfirmMsgBody').html(obj.totalUserToBeCommunicateMessage);

                   $('#totalUserCount').val(obj.totalUserCount);

                   $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                       .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                       e.preventDefault();

                       if($('#isCD').length > 0) {
                           $('#isCD').val('1');
                           $('form#bulkWhatsappCommunication').submit();
                           $('#ConfirmPopupArea').modal('hide');
                       }
                   });
               }else if(typeof obj.communicationMessageCheck != 'undefined' && obj.communicationMessageCheck != ''){
                       $('#TemplateCreationSubmitBtn1').removeAttr('disabled');
           $('.modalLoader, #listloader').hide();
           $('.modalLoader').css('position', 'absolute');
                       $("#confirmYes").removeAttr('onclick');
                       $('#confirmTitle').html("Confirm");
                       $("#confirmYes").html('Ok');
                       $("#confirmYes").siblings('button').remove();
                       $('#ConfirmMsgBody').html(obj.communicationMessageCheck);
           $('#ConfirmPopupArea').css('z-index', '11111');

                       $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
                           .off('click', '#confirmYes').one('click', '#confirmYes', function (e) {
                           e.preventDefault();
                           if($('#isCD').length > 0) {
                               window.location.href='';
                           }
                       });
               }else{
                   $('#dispsuccess').hide();
                   $('#disperror').show();
                   $('#dispsuccess').html('');
                   $('#disperror').html('Some Error in sending Whatsapp, please try again later.');
                   $('#commSubmitBtn').removeAttr('disabled');
                   $('.modalLoader, #listloader').hide();
                   $('.modalLoader').css('position', 'absolute');
                   $(".modal-content").animate({ scrollTop: 0}, 1000);
               }
               $('#donothing').focus();
               $('div.loader-block').hide();
           },
           error: function (xhr, ajaxOptions, thrownError) {
               //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
               console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           }
       });
       return false;
   })

});

/**
* ctype only for identify calling from which function
* @param {type} user_id
* @param {type} form_id
* @param {type} ctype
* @returns {undefined}
*/
function communicationComment(user_id,form_id,ctype,college_id){
    $('#loader_block_right_bx').show();
   if(typeof ctype=='undefined'){
       ctype='';
   }
   $('#comm_action_html').html('');
   $('#credit_info_msg_single').html('');
   var fd_id = $('#fdid').val();

   if(typeof fd_id == 'undefined'){
          fd_id =0;
   }
   $.ajax({
       cache: false,
       url: '/communications/communication-comment',
       type: 'post',
       data: {'user_id':user_id,'form_id':form_id,"fd_id":fd_id,'college_id':college_id, ctype:ctype},
       dataType: 'html',
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function() {
           $('.modalLoader').show();
       },
       complete: function() {
           $('.modalLoader').hide();
       },
       success: function (response) {
            if(ctype=='userleads' || (ctype=='applications' && fd_id)){
               $('#single_communication_html').html(response);
           }else{
               $('#comm_action_html').html(response);
           }
           $('.modalLoader').hide();
           $('#loader_block_right_bx').hide();
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            $('#contact-us-final div.loader-block').hide();
       }
   });

 return;
}

function communicationSms(user_id,form_id,ctype,college_id){
    $('#loader_block_right_bx').show();
   //NPF-1211 10.3 || LMS & Application Manager revamp
   var mlead ='';
   if(ctype == 'userleads'){
      mlead = "userleads";
   }else if(ctype=='applications'){
     mlead = "applications";
   }else if(ctype=='assessment_score'){
     mlead = "assessment_score";
   }
   $('#credit_info_msg_single').html('');
   $('#comm_action_html').html('');
   applicant_name = $('#applicantName').val();
   var fd_id = $('#fdid').val();
   if(typeof applicant_name == 'undefined'){
          applicant_name ='';
   }
   if(typeof fd_id == 'undefined'){
          fd_id =0;
   }
   $.ajax({
       cache: false,
       url: '/communications/communication-sms',
       type: 'post',
       data: {'user_id':user_id,'form_id':form_id,'fd_id':fd_id, 'applicant_name' : applicant_name,'ctype':mlead,'college_id':college_id},
       dataType: 'html',
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function() {
           $('.modalLoader').show();
       },
       complete: function() {
           $('.modalLoader').hide();
           $('#loader_block_right_bx').hide();
       },
       success: function (response) {
           if(ctype=='userleads' || ctype=='assessment_score' || (ctype=='applications' && fd_id)){
               $('#single_communication_html').html(response);
           }else{
               $('#comm_action_html').html(response);
           }
           $("#SMSTextArea").attr('disabled','disabled');
           $('.modalLoader').hide();
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            $('#contact-us-final div.loader-block').hide();
       }
   });

 return;
}

function communicationWhatsApp(user_id,form_id,ctype,college_id,type,national_sender='',international_sender=''){
    $('#loader_block_right_bx').show();
   //NPF-1211 10.3 || LMS & Application Manager revamp
   var mlead ='';
   if(ctype == 'userleads'){
      mlead = "userleads";
   }else if(ctype=='applications'){
     mlead = "applications";
   }
   $('#credit_info_msg_single').html('');
   $('#comm_action_html').html('');
   applicant_name = $('#applicantName').val();
   var fd_id = $('#fdid').val();
   if(typeof applicant_name == 'undefined'){
          applicant_name ='';
   }
   if(typeof fd_id == 'undefined'){
          fd_id =0;
   }
   if(type === 'whatsapp_business') {
       var Url = '/communications/communication-whatsapp-business';
   }else{
       var Url = '/communications/communication-whatsapp';
   }
   $.ajax({
       cache: false,
       url: Url,
       type: 'post',
       data: {'user_id':user_id,'form_id':form_id,'fd_id':fd_id, 'applicant_name' : applicant_name,'ctype':mlead,'college_id':college_id,'type':type,'national_sender':national_sender,'international_sender':international_sender},
       dataType: 'html',
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function() {
           $('.modalLoader').show();
       },
       complete: function() {
           $('.modalLoader').hide();
           $('#loader_block_right_bx').hide();
       },
       success: function (response) {
           if (response['redirect'])
               location = json['redirect'];
           else if(ctype=='userleads' || (ctype=='applications' && fd_id)){
               $('#single_communication_html').html(response);
           }else{
               $('#comm_action_html').html(response);
           }
           $('.modalLoader').hide();
           $('.nav-style-3 li[role="presentation"]').removeClass('active');
           $('.html_communicationWhatsApp').addClass('active');
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            $('#contact-us-final div.loader-block').hide();
       }
   });

 return;
}

function communicationActivity(user_id,form_id,ctype){
   if(typeof ctype=='undefined'){
       ctype='';
   }
   $('#credit_info_msg_single').html('');
   $('#comm_action_html').html('');
   $('div.loader-block').show();
   $.ajax({
       cache: false,
       url: '/communications/communication-activity',
       type: 'post',
       data: {'user_id':user_id,'form_id':form_id},
       dataType: 'html',
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function() {
           $('#graphStatsLoaderConrainer').show();
       },
       complete: function() {
           $('#graphStatsLoaderConrainer').hide();
       },
       success: function (response) {
           if(ctype=='userleads'){
               $('#single_communication_html').html(response);
               $('div.loader-block').hide();
           }else{
               $('#comm_action_html').html(response);
               $('div.loader-block').hide();
           }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            $('#contact-us-final div.loader-block').hide();
       }
   });

 return;
}

function communicationEmail(user_id,form_id,ctype,college_id){
    $('#loader_block_right_bx').show();
    $('div.loader-block').hide();

   //NPF-1211 10.3 || LMS & Application Manager revamp
   var mlead ='';
   var cid = '';
   if(ctype == 'userleads'){
      mlead = "userleads";
   }else if(ctype=='applications'){
     mlead = "applications";
   }else if(ctype=='assessment_score'){
     mlead = "assessment_score";
   }
   if(college_id!=''){
       cid = college_id;
   }
   // blank credit info
   $('#credit_info_msg_single').html('');
   $('#comm_action_html').html('');
   $('.comtab').removeClass('active');
   $('.communicationEmail').addClass('active');
   applicant_name = $('#applicantName').val();
   var fd_id = $('#fdid').val();
   if(typeof applicant_name == 'undefined'){
          applicant_name ='';
   }
   if(typeof fd_id == 'undefined'){
          fd_id =0;
   }
   $.ajax({
       cache: false,
       url: '/communications/communication-email',
       type: 'post',
       data: {'user_id':user_id,'form_id':form_id, 'fd_id':fd_id, 'applicant_name':applicant_name,'ctype':mlead,'college_id':cid},
       dataType: 'html',
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function() {
           if(typeof CKEDITOR != 'undefined' && typeof CKEDITOR.instances['editor'] != 'undefined')  removeCKEditor('editor');
           $('.modalLoader').show();
           $('#CommunicationSingleAction .modal-dialog').removeClass('modal-lg').addClass('modal-xlg');
       },
       complete: function() {
           //$('div.loader-block').hide();
           $('.modalLoader').hide();
           $('#loader_block_right_bx').hide();
       },
       success: function (response) {
           if(typeof ctype!='undefined' && ctype=='userleads'){
               $('#single_communication_html').html(response);
           } else if(typeof ctype!='undefined' && ctype=='applications' && fd_id){
               $('#single_communication_html').html(response);
           }else if(typeof ctype!='undefined' && ctype=='assessment_score'){
               $('#single_communication_html').html(response);
           }else {
               $('#comm_action_html').html(response);
           }
           setTimeout(function() {
               $('#TemplateListSelect').val('unlayer').trigger('chosen:updated').trigger('change');
           }, 1000);
           $('.modalLoader').hide();
           $('#CommunicationSingleAction .modal-dialog').removeClass('modal-lg').addClass('modal-xlg');
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            $('#contact-us-final div.loader-block').hide();
       }
   });

 return;
}


//Return Html content of predefined ctp files
function getTemplatedDetailsById(template_id,template_type) {
   if(typeof template_type === 'undefined' || template_type=== ''){
       template_type = 'email';
   }

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
           if(typeof unlayerTemplateText != 'undefined')    unlayerTemplateText = '';
       },
       complete: function () {
           $('.modalLoader').hide();
       },
       //contentType: "application/json; charset=utf-8",
       success: function (json) {
           if (json['redirect'])
               location = json['redirect'];
           else if (json['error'])
               alertPopup(json['error'], 'error');
           else if (json['success'] == 200) {

               if(template_type=='sms'){
                   $('#SMSTextArea').val(json['data']['template_text']);

                   $("#SMSTextArea").attr('disabled','disabled');
                   $('#SMSTextArea').parent().addClass('floatify__active');

           charcterCount();
                   if(json['data']['multi_lang']){
                       $('#multi_lang').prop('checked', true);
                   }else{
                       $('#multi_lang').prop('checked', false);
                   }
                   if(!(json['data']['canEdit'])){
                       $('#SMSTextArea').prop('readonly',true);
                       $('#SMSMappingSeletct').prop('disabled',true);
                       $("#SMSMappingSeletct").trigger("chosen:updated");
                   }else if(json['data']['canCreate']) {
                       $('#SMSTextArea').prop('readonly',false);
                       $('#SMSMappingSeletct').prop('disabled',false);
                       $("#SMSMappingSeletct").trigger("chosen:updated");
                   }
               }else if(template_type=='whatsapp'){
                   $('#WhatsAppTextArea').val(json['data']['template_text']);
                   if(!(json['data']['canEdit'])){
                       $('#WhatsAppTextArea').prop('readonly',true);
                       $('#WhatsAppMappingSelect').prop('disabled',true);
                       $("#WhatsAppMappingSelect").trigger("chosen:updated");
                   }else if(json['data']['canCreate']) {
                       $('#WhatsAppTextArea').prop('readonly',false);
                       $('#WhatsAppMappingSelect').prop('disabled',false);
                       $("#WhatsAppMappingSelect").trigger("chosen:updated");
                   }
               }else if(template_type==='whatsapp_business'){
                   $('#WhatsAppTextArea').val(json['data']['template_text']);
                   $("#WhatsAppTextArea").attr('disabled','disabled');

                   $('#UploadFileInfoContainer').html('');
                   $('#UploadFileInfoContainer').html(json['data']['file']);
                   if(!(json['data']['canEdit'])){
                       $('#WhatsAppTextArea').prop('readonly',true);
                       $('#WhatsAppMappingSelect').prop('disabled',true);
                       $("#WhatsAppMappingSelect").trigger("chosen:updated");
                   }else if(json['data']['canCreate']) {
                       $('#WhatsAppTextArea').prop('readonly',false);
                       $('#WhatsAppMappingSelect').prop('disabled',false);
                       $("#WhatsAppMappingSelect").trigger("chosen:updated");
                   }
               }else{
                   $('#UploadFileInfoContainer').html('');
                   $('#subject').val(json['data']['subject']);
                   $('#subject').parent().addClass('floatify__active');
                   $('#UploadFileInfoContainer').html(json['data']['file']);
                   if(typeof json['data']['template_editor'] != 'undefined' && typeof ckEditorTokens != 'undefined' && json['data']['template_editor'] ==  1) {
                       initCKEditor(ckEditorTokens);
                       CKEDITOR.instances['editor'].setData(json['data']['template_text']);
                       $(".ck-edit").remove();
                       $('#editor-container + div').prepend('<div class="ck-edit"></div>');
                       if(!(json['data']['canEdit'])){
                           window.setTimeout(function(){
                               CKEDITOR.instances['editor'].setReadOnly();
                           },500);
                           $('.ck-edit').addClass('ck-edit-disable');
                           $('#subject').attr('readonly',true);
                       }
                       $('#editor-container').hide();
                   } else if(typeof json['data']['template_editor'] != 'undefined' && json['data']['template_editor'] ==  2
                           && typeof json['data']['template_json'] != 'undefined' && typeof unlayerMergeTags != 'undefined') {
                       if(typeof CKEDITOR !='undefined' && typeof CKEDITOR.instances['editor'] !='undefined' ) removeCKEditor('editor');
                       $('.unlayer-edit').remove();
                       $('#editor-container').prepend('<div class="unlayer-edit"><div class="mask-unlayer"></div></div>');
                       if($('#appUnlayerIframeDiv').length > 0) {
                           $('#editor-container').hide();
                           updateTemplatePreview(json['data']['id']);
                       } else {
                           $('#editor-container').show();
                           if(typeof unlayer.frame == 'undefined' || unlayer.frame == null) {
                               initUnlayerEditor(unlayerMergeTags, JSON.parse(json['data']['template_json']));
                           } else {
                               unlayer.setMergeTags(unlayerMergeTags);
                               unlayer.loadDesign(JSON.parse(json['data']['template_json']));
                           }
                       }
                       if(!(json['data']['canEdit'])){
                           unlayer.showPreview("desktop");
                           $('.unlayer-edit').addClass('unlayer-edit-disable');
                           $('#subject').attr('readonly',true);
                       }
                   }
                   //instead of $(textarea).val(result);
               }
               if($('#TemplateListSelect').length > 0){

                   if(json['data']['template_editor']==2){
                       $('#editor-container').show();
                       json['data']['template_text']
                   }

                   if($('#TemplateListSelect').val() !==''){
                       $('#TemplateListSelect').parent().addClass('floatify floatify__left floatify__active');
                   }
                   $('#TemplateListSelect').change(function(){
                       if($('#TemplateListSelect').val() !==''){
                           $('#TemplateListSelect').parent().addClass('floatify floatify__left floatify__active');
                       }else{
                           $('#TemplateListSelect').parent().removeClass('floatify floatify__left');
                           $('#subject').parent().removeClass('floatify__active');
                       }
                   })
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

function LoadMoreCommunicationComments(user_id,form_id) {

//        var data = $('#FilterReportsForm').serializeArray();
   $('#load_more_button').attr("disabled", "disabled");
   $('#load_more_button').html("Loading...");
   $.ajax({
       url: '/communications/ajax-comment-list',
       type: 'post',
       dataType: 'html',
       data: {"user_id":user_id,"form_id":form_id,"page": Page},
       headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
       success: function (data) {
           Page = Page+ 1;
           if (data == "error") {
               $('.select-option-block').html("<div class='alert alert-danger'>No More Records</div>");
               $('#load_more_button').hide();
           }
           else {
               $('#loadAjaxComment').append(data);
               $('#load_more_button').removeAttr("disabled");
               $('#load_more_button').html("Next Page");
           }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function LoadMoreCommunicationActivity(user_id,form_id,days,daycall) {

   var activity_group = '';
   if(typeof days =='undefined' || days==''){
       days = 0;
   }
   if(typeof daycall =='undefined' || daycall==''){
       daycall = '';
   }
   if($('#activity_group').val()!=''){
       activity_group = $('#activity_group').val();
   }
   if(days>0 || daycall!=''){
       $('#loadAjaxActivity').html('');
       Page = 0;
       $('#load_more_button').hide();
   }

   if(days==0 || days==''){
       $('#load_more_button').show();
   }

//        var data = $('#FilterReportsForm').serializeArray();
   $('#load_more_button').attr("disabled", "disabled");
   $('#load_more_button').html("Loading...");

   $.ajax({
       url: '/communications/ajax-activity-list',
       type: 'post',
       dataType: 'html',
       data: {"user_id":user_id,"form_id":form_id,"page": Page,'days':days,'activity_group':activity_group},
       headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
       success: function (data) {
           Page = Page+ 1;
           if (data == "error") {
               $('#loadAjaxActivity').append(" <div class='alert alert-danger'>No More Records</div>");
               $('#load_more_button').hide();
           }
           else {

               $('#loadAjaxActivity').append(data);

               $('#load_more_button').removeAttr("disabled");
               $('#load_more_button').html("Next Page");
           }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}


/**
* Communication Popup Code
*
*/
function bulkCommunicationAction(ctype,info)
{
   $('#listloader').show();
   var total_checked=0;
   var display_popup = false;
   $('input:checkbox[name="selected_users[]"]').each(function () {
       if(this.checked){
           display_popup = true;
           total_checked++;
       }
      //var sThisVal = (this.checked ? $(this).val() : "");
   });

   var checkbox_alert=false;
   var select_all = $('#select_all:checked').val();
   //By default Set communication popup Tab Text
   //$('#bulk_communication_action li:first').find('span').html('Bulk Email');
   //$('#bulk_communication_action li:nth-child(2)').find('span').html('Bulk SMS');

   /**
    * In Marketing leads if communicate with bulk then check whether atleast 2 checkbox is checked
    */
   if((ctype != '') && ((ctype == 'mktg_leads_list') || (ctype == 'mktg_leads') || (ctype == 'mktg_segments_list') ||
       (ctype == 'mktg_segments') || (ctype=='assessment_score'))) {
       $(communicationInfoVariableId).val(info);
       //set ctype
       $('input#ctype').val(ctype);
       //Check how many records are there as per filter so if only 1 record found then bulk action should work
       var total_result=0;
       if($('#all_records_val').length>0) {
           total_result = $('#all_records_val').val();
       }

       if(total_result>1) {
           if(display_popup == false ) {
               display_popup =false;
           } else if(total_checked<2) {
               display_popup =false;
               checkbox_alert=true;
           }
       }
       // if no list is selected
       if(ctype == 'mktg_leads_list'){
           if(total_checked<2){
               select_all = '';
           }
       }

       // check if checkbox is selected
       if(ctype == 'mktg_segments_list' && isMultipleCheckboxChecked('select_id',2)==false){
           select_all = '';
       }
       //change onclick function
       var elemEmail = $('#CommunicationBulkAction #comm_email_heading').closest('a');
       var elemSMS = $('#CommunicationBulkAction #comm_sms_heading').closest('a');
       elemEmail.attr('onclick','bulkCommunicationAction(\'' + ctype + '\', \''+info+ '\');');
       elemSMS.attr('onclick','bulkSmsCommunication(\'' + ctype + '\');');
       if(($('#single_user_id').length > 0) && ($('#single_user_id').val() !== '')) {
           var single_user_id = $('#single_user_id').val();
           elemEmail.attr('onclick','setSingleValue(\''+ single_user_id +'\'); bulkCommunicationAction(\'' + ctype + '\', \''+info+ '\');');
           elemSMS.attr('onclick','setSingleValue(\''+ single_user_id +'\'); bulkSmsCommunication(\'' + ctype + '\');');
       }

   }
   else if((ctype != '') && ((ctype == 'leads_segments') || (ctype == 'applications_segments'))) {
       //Check how many records are there as per filter so if only 1 record found then bulk action should work
       //communicate for leads/applications list segment on manage segment page
       var total_result = 0;
       display_popup = false;
       //set ctype
       $(communicationInfoVariableId).val(info);
       $('form#segmentManager input#ctype').val(ctype);
       var list_manager_id = $('form#segmentManager #list_manager_id').val();

       //Get total unique email count
       if($('form#segmentManager #single_user_id').length > 0) {
           total_result = $('form#segmentManager #single_user_id').val();  //stores total unique emails count
           $('form#segmentManager #single_user_id').val('');   //set empty value other wise communication pop comes
           $('#select_all:checked').trigger('click');  //set unchecked other wise communication pop comes
       }
       //if total unique email count is greater than 0
       if(parseInt(total_result) > 0) {
           display_popup = true;
       }

       //change onclick function
       var elemEmail = $('#CommunicationBulkAction #comm_email_heading').closest('a');
       elemEmail.attr('onclick','setSingleValue(\''+ total_result +'\',\'' + list_manager_id +'\'); bulkCommunicationAction(\'' + ctype + '\', \''+info+ '\');');
       var elemSMS = $('#CommunicationBulkAction #comm_sms_heading').closest('a');
       elemSMS.attr('onclick','setSingleValue(\''+ total_result +'\',\'' + list_manager_id +'\'); bulkSmsCommunication(\'' + ctype + '\');');

   }
   else if((ctype !== '') && (ctype === 'leads_list' || ctype === 'applications_list')) {
       //communicate for leads/applications list on manage list page
       var total_result = 0;
       display_popup = false;
       //set ctype
       $(communicationInfoVariableId).val(info);
       $('form#listManager input#ctype').val(ctype);
       var list_manager_id = $('form#listManager #list_manager_id').val();
       //Get total unique email count
       if($('form#listManager #single_user_id').length > 0) {
           total_result = $('form#listManager #single_user_id').val();  //stores total unique emails count
           $('form#listManager #single_user_id').val('');   //set empty value other wise communication pop comes
           $('#select_all:checked').trigger('click');  //set unchecked other wise communication pop comes
       }

       //if total unique email count is greater than 0
       if(parseInt(total_result) > 0) {
           display_popup = true;
       }

       //change onclick function
       var elemEmail = $('#CommunicationBulkAction #comm_email_heading').closest('a');
       elemEmail.attr('onclick','setSingleValue(\''+ total_result +'\',\'' + list_manager_id +'\'); bulkCommunicationAction(\'' + ctype + '\', \''+info+ '\');');
       var elemSMS = $('#CommunicationBulkAction #comm_sms_heading').closest('a');
       elemSMS.attr('onclick','setSingleValue(\''+ total_result +'\',\'' + list_manager_id +'\'); bulkSmsCommunication(\'' + ctype + '\');');
   }

   if(display_popup ||
      select_all == 'select_all' ||
      ($('#single_user_id').length>0 && $('#single_user_id').val() != '' )
           ){
       // display bulk action popup
       $('h2#alertTitle').html('Bulk Communication');
       $('#CommunicationBulkAction').modal();
       $('#bulk_communication_action').show();
       $('#credit_info_msg').show();
       $('#bulk_communication_action li').each(function(){
           $(this).removeClass('active');
       });
       $('#bulk_communication_action li:first').addClass('active');

       if(typeof jsVars.PermissionList['bulkEmailCommunication'] !='undefined' && jsVars.PermissionList['bulkEmailCommunication']==true){
           bulkEmailCommunication(ctype);
       }else if(typeof jsVars.PermissionList['bulkSmsCommunication'] !='undefined' && jsVars.PermissionList['bulkSmsCommunication']==true){
           bulkSmsCommunication(ctype);
       }else if(typeof jsVars.PermissionList['bulkVoiceSmsCommunication'] !='undefined' && jsVars.PermissionList['bulkVoiceSmsCommunication']==true){
           bulkVoiceSmsCommunication(ctype);
       }

       /*if(ctype =='userleads'){//use for user leads Lms
            //code heare
           if(typeof jsVars.PermissionList['bulkEmailCommunication'] !='undefined' && jsVars.PermissionList['bulkEmailCommunication']==true){
               bulkEmailCommunication(ctype);
           }else if(typeof jsVars.PermissionList['bulkSmsCommunication'] !='undefined' && jsVars.PermissionList['bulkSmsCommunication']==true){
               bulkSmsCommunication(ctype);
           }else if(typeof jsVars.PermissionList['bulkVoiceSmsCommunication'] !='undefined' && jsVars.PermissionList['bulkVoiceSmsCommunication']==true){
               bulkVoiceSmsCommunication(ctype);
           }

       }
       else if(ctype =='applications'){
           //code heare
           if(typeof jsVars.PermissionList['bulkEmailCommunication'] !='undefined' && jsVars.PermissionList['bulkEmailCommunication']==true){
               bulkEmailCommunication(ctype);
           }else if(typeof jsVars.PermissionList['bulkSmsCommunication'] !='undefined' && jsVars.PermissionList['bulkSmsCommunication']==true){
               bulkSmsCommunication(ctype);
           }else if(typeof jsVars.PermissionList['bulkVoiceSmsCommunication'] !='undefined' && jsVars.PermissionList['bulkVoiceSmsCommunication']==true){
               bulkVoiceSmsCommunication(ctype);
           }
       }
       else if(ctype =='mktg_leads'){
           //code heare
           if(typeof jsVars.PermissionList['bulkEmailCommunication'] !='undefined' && jsVars.PermissionList['bulkEmailCommunication']==true){
               bulkEmailCommunication(ctype);
           }else if(typeof jsVars.PermissionList['bulkSmsCommunication'] !='undefined' && jsVars.PermissionList['bulkSmsCommunication']==true){
               bulkSmsCommunication(ctype);
           }else if(typeof jsVars.PermissionList['bulkVoiceSmsCommunication'] !='undefined' && jsVars.PermissionList['bulkVoiceSmsCommunication']==true){
               bulkVoiceSmsCommunication(ctype);
           }
       }
       else{
           if(typeof jsVars.PermissionList['bulkEmailCommunication'] !='undefined' && jsVars.PermissionList['bulkEmailCommunication']==true){
               bulkEmailCommunication(ctype);
           }
           else if(typeof jsVars.PermissionList['bulkVoiceSmsCommunication'] !='undefined' && jsVars.PermissionList['bulkVoiceSmsCommunication']==true){
               bulkVoiceSmsCommunication(ctype);
           }
           else if(typeof jsVars.PermissionList['bulkSmsCommunication'] !='undefined' && jsVars.PermissionList['bulkSmsCommunication']==true){
               bulkSmsCommunication(ctype);
           }
       }*/
   }else{
       $('#listloader').hide();
       /**
        * Show alert message if checkbox is not checked as per ctype
        * By default it will show "Please select User" message in alert popup
        *
        */
       var message='Please select User';
       switch(ctype){
           case 'leads_list':
           case 'applications_list':
           case 'leads_segments':
           case 'applications_segments':
               message='No Lead Found!';
               break;
           case 'mktg_leads_list':
               if(checkbox_alert ==true) {
                   message='Please select more than one list name';
               } else {
                   message='Please select list name';
               }
               break;
           case 'mktg_segments_list':
               if(checkbox_alert ==true) {
                   message='Please select more than one segment name';
               } else {
                   message='Please select segment name';
               }
               break;
           case 'mktg_leads':
           case 'assessment_score':
           case 'mktg_segments':
               if(checkbox_alert ==true) {
                   message='Please select more than one user';
               }
               break;
       }
       alertPopup(message,'error');
   }

}


/**
* Communication Popup Code
*
*/
function bulkCommunicationPopup()
{
   $('#listloader').show();
   var total_checked=0;
   var display_popup = false;
   $('input:checkbox[name="selected_users[]"]').each(function () {
       if(this.checked){
           display_popup = true;
           total_checked++;
       }
   });

   var checkbox_alert  = false;
   var select_all      = $('#select_all:checked').val();
   var ctype           = $('input#ctype').val();

//     if( ctype == 'mktg_leads') {
//        $('.search_comm_list_manger_raw').val('');
//    }

   if(ctype == 'applications' || ctype == 'userleads' || ctype == 'mktg_leads' ){
       if(typeof is_filter_button_pressed =='undefined' || is_filter_button_pressed != 1){
           alertPopup('It seems you have changed the filter but not Applied it. Please re-check the same to proceed further.','error');
           $('#listloader').hide();
           return;
       }
   }

   if( ctype === 'mktg_leads' || ctype === 'mktg_segments' || ctype === 'examComm' || ctype==='assessment_score') {
       //Check how many records are there as per filter so if only 1 record found then bulk action should work
       var total_result=0;
       if($('#all_records_val').length>0) {
           total_result = $('#all_records_val').val();
       }

       // In Marketing leads if communicate with bulk then check whether atleast 2 checkbox is checked
       if( display_popup!==false && total_result>1 && total_checked<2 ) {
           display_popup =false;
           checkbox_alert=true;
       }

       //change onclick function
       var elemEmail = $('#CommunicationBulkAction #comm_email_heading').closest('a');
       var elemSMS = $('#CommunicationBulkAction #comm_sms_heading').closest('a');
       elemEmail.attr('onclick','bulkCommunicationPopup();');
       elemSMS.attr('onclick','bulkSmsCommunication(\'' + ctype + '\');');
       if(($('#single_user_id').length > 0) && ($('#single_user_id').val() !== '')) {
           var single_user_id = $('#single_user_id').val();
           elemEmail.attr('onclick','setSingleValue(\''+ single_user_id +'\'); bulkCommunicationPopup();');
           elemSMS.attr('onclick','setSingleValue(\''+ single_user_id +'\'); bulkSmsCommunication(\'' + ctype + '\');');
       }

   }

   if(display_popup ||
      select_all == 'select_all' ||
      ($('#single_user_id').length>0 && $('#single_user_id').val() != '' )
           ){
       // display bulk action popup
       if($('#single_communication').length>0 && $('#single_communication').val() == "true") {
           $('h2#alertTitle').html('Single Communication');
       } else {
           $('h2#alertTitle').html('Bulk Communication');
       }
       $('#CommunicationBulkAction').modal();
       $('#bulk_communication_action').show();
       $('#credit_info_msg').show();
       $('#bulk_communication_action li').each(function(){
           $(this).removeClass('active');
       });
       $('#bulk_communication_action li:first').addClass('active');

       if(typeof jsVars.PermissionList['bulkEmailCommunication'] !=='undefined' && jsVars.PermissionList['bulkEmailCommunication']==true){
           bulkEmailCommunication(ctype);
       }else if(typeof jsVars.PermissionList['bulkSmsCommunication'] !=='undefined' && jsVars.PermissionList['bulkSmsCommunication']==true){
           bulkSmsCommunication(ctype);
       }else if(typeof jsVars.PermissionList['bulkVoiceSmsCommunication'] !=='undefined' && jsVars.PermissionList['bulkVoiceSmsCommunication']==true){
           bulkVoiceSmsCommunication(ctype);
       }else if(typeof jsVars.PermissionList['enableBulkNotificationPermission'] !=='undefined' && jsVars.PermissionList['enableBulkNotificationPermission']==true){
           bulkNotificationCommunication(ctype);
       }
   }else{
       $('#listloader').hide();
       /**
        * Show alert message if checkbox is not checked as per ctype
        * By default it will show "Please select User" message in alert popup
        *
        */
       var message='Please select User';
       switch(ctype){
           case 'leads_list':
           case 'applications_list':
           case 'leads_segments':
           case 'applications_segments':
               message='No Lead Found!';
               break;
           case 'mktg_leads_list':
               if(checkbox_alert ==true) {
                   message='Please select more than one list name';
               } else {
                   message='Please select list name';
               }
               break;
           case 'mktg_segments_list':
               if(checkbox_alert ==true) {
                   message='Please select more than one segment name';
               } else {
                   message='Please select segment name';
               }
               break;
           case 'mktg_leads':
           case 'assessment_score':
           case 'mktg_segments':
               if(checkbox_alert ==true) {
                   message='Please select more than one user';
               }
               break;
       }
       alertPopup(message,'error');
   }

}

function bulkEmailCommunication(ctype){
   $('div.loader-block').hide();
   var total_count = $('#tot_records').text();
   var all_records = $('#all_records_val').val();
   var assessmentTotal = $("#assessmentTotal").val();
   if(assessmentTotal!='' && assessmentTotal=='undefined'){
      ctype = 'assessment_score';
   }
   var list_manager_id = '';

   if(ctype === 'applications'){
       var data = $(' #FilterApplicationForms').serializeArray();
   }
   else if((ctype === 'leads_list') || (ctype === 'applications_list'))
   {
       var data = $('#listManager').serializeArray();
       list_manager_id = $('#list_manager_id').val();
       total_count = all_records = '';
   }
   else if((ctype === 'leads_segments') || (ctype === 'applications_segments'))
   {
       var data = $('form#segmentManager').serializeArray();
       list_manager_id = $('form#segmentManager #list_manager_id').val();
       total_count = all_records = '';
   }
   else if(ctype == 'mktg_leads' || ctype == 'mktg_segments')
   {
       var data = $('#manageContacts').serializeArray();
       var select_all = $('#select_all:checked').val();
       //this for single communication
       if($('#single_user_id').val()!='') {
          var all_records=total_count=1;
       }else if(typeof select_all=='undefined'){
           var all_records=total_count='';
       }
   }
   else if(ctype=='mktg_leads_list'){
       var listid = $("#single_user_id").val();
       var data = $('#listManager').serializeArray();
       //single communication
       if(listid !== ''){
           data.push({name: "list_id", value: listid});
           all_records = $('#total_unique_email_'+ listid).val();
           total_count= "Total "+ all_records +" Records";
       }
   }
   else if(ctype=='mktg_segments_list'){
       var segment_id = '';
       if($('#single_user_id').val()>0) {
          segment_id= $('#single_user_id').val();
       }
       var data = $('#segmentManager').serializeArray();
       //for single communication
       if(typeof segment_id !== 'undefined' && segment_id !== ''){
           data.push({name: "segment_id", value: segment_id});
           all_records = total_count = '';
           all_records = $('#segment_'+segment_id).find('td:nth-child(5)').text(); //$('#total_unique_email_'+segment_id).val();
           total_count= "Total "+ all_records +" Records";
       }
   }
   else if(ctype == 'assessment_score')
   {
       var arr = $('.select_users:checked').map(function(){
           return this.value;
       }).get();

       var data = $('#assessmentListingFormMain').serializeArray();
       data.push({name: "selected_users", value: arr});
       var select_all = $('#select_all:checked').val();
       //this for single communication
       if($('#single_user_id').val()!='') {
          var all_records=assessmentTotal;
       }else if(typeof select_all=='undefined'){
           var all_records=assessmentTotal
       }
       total_count = assessmentTotal;
   }
   else if(ctype=='userleads') {
       var data = $('#FilterLeadForm').serializeArray();
   }else if(ctype=='examComm') {
       var data = $('#ExamForm').serializeArray();
   }else{
       $('#listloader').hide();
       alertPopup('We are not able to process your request right now. Please refresh the page and try again. In case, you face the issue again, get in touch with your dedicated Account Manager.','error');
       return;
   }

   data.push({name: "total_count", value: total_count});
   data.push({name: "all_records", value: all_records});
   data.push({name: "ctype", value: ctype});
   data.push({name: "list_manager_id", value: list_manager_id});
   $.ajax({
       url: '/communications/bulk-email-communication',
       type: 'post',
       dataType: 'html',
       data: data,
//        async: false,
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       beforeSend: function () {
           if(typeof CKEDITOR != 'undefined' && typeof CKEDITOR.instances['editor'] != 'undefined')  removeCKEditor('editor');
           $('.modalLoader').show();
           $('#listloader').hide();
           $('#CommunicationBulkAction .modal-dialog').removeClass('modal-lg').addClass('modal-xlg');
       },
       success: function (data) {
            $('.modalLoader').hide();
           //$('#bulkloader').show();
           $('#bulk_communication_html').html(data);
           if(ctype == 'assessment_score'){
               $(".schedule_div").hide();
               $(".testemail_div").hide();
               $(".recurringBtn").hide();
           }
           setTimeout(function() {
               $('#TemplateListSelect').val('unlayer').trigger('chosen:updated').trigger('change');
           }, 1000);
           floatableLabel();
           browseWidget();
           $('#CommunicationBulkAction .modal-dialog').removeClass('modal-lg').addClass('modal-xlg');
           if (document.documentElement.clientWidth > 992) {
               $('#bulk_communication_html [data-toggle="tooltip"]').tooltip({
                   placement: 'top',
                   trigger : 'hover',
                   template: '<div class="tooltip layerTop" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
               });
               tourCommunication();
           }
           //$.material.init();
//                $('div.loader-block').hide();

           //$('#bulk_communication_action li:first').find('span').html('Bulk Email');
           if(ctype!='' && (ctype=='mktg_leads_list' || ctype=='mktg_leads' || ctype=='mktg_segments_list' || ctype=='mktg_segments') ) {
               //If single id is selected then set text to Single Email/SMS
               if($('#to_email').length>0) {
                       var totalEmail=parseInt($('#to_email').val());
                       if(totalEmail==1) {
                           //$('#bulk_communication_action li:first').find('span').html('Single Email');
                       }
               }
           }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });

}

function bulkSmsCommunication(ctype){
   var all_records = ($('#all_records_val').length>0?$('#all_records_val').val():0);

   $('div.loader-block').hide();
   $('#bulkloader').show();
   var total_count = $('#tot_records').text();
   var assessmentTotal = $("#assessmentTotal").val();
   var all_records = $('#all_records_val').val();//$('#all_records').text();
   var list_manager_id = '';

   if(assessmentTotal!='' && assessmentTotal=='undefined'){
      ctype = 'assessment_score';
   }
   if(ctype=='applications'){
       var data = $(' #FilterApplicationForms').serializeArray();
   }
   else if((ctype === 'leads_list') || (ctype === 'applications_list'))
   {
       var data = $('#listManager').serializeArray();
       list_manager_id = $('#list_manager_id').val();
       all_records = total_count = '';
   }
   else if((ctype === 'leads_segments') || (ctype === 'applications_segments'))
   {
       var data = $('form#segmentManager').serializeArray();
       list_manager_id = $('form#segmentManager #list_manager_id').val();
       total_count = all_records = '';
       $('form#segmentManager #single_user_id').val('');
   }
   else if(ctype=='mktg_leads' || ctype=='mktg_segments'){
       var data = $('#manageContacts').serializeArray();
       var select_all = $('#select_all:checked').val();
       if($('#single_user_id').val()!='') {
          all_records = total_count = 1;
       }
       else if (typeof select_all=='undefined'){
           all_records = total_count = '';
       }
   }
   else if(ctype=='assessment_score'){
       var data = $('#assessmentListingFormMain').serializeArray();
       var select_all = $('.select_users:checked').val();
       if($('#single_user_id').val()!='') {
          all_records = assessmentTotal;
       }
       else if (typeof select_all=='undefined'){
           all_records = assessmentTotal;
       }
       total_count = assessmentTotal;
       var arr = $('.select_users:checked').map(function(){
           return this.value;
       }).get();
       data.push({name: "selected_users", value: arr});
   }
   else if(ctype=='mktg_leads_list'){
       var listid = $("#single_user_id").val();
       var data = $('#listManager').serializeArray();
       if(listid!=''){
           all_records = total_count = '';
           data.push({name: "list_id", value: listid});
           all_records = $('#total_unique_mobile_'+listid).val();
           total_count= "Total "+all_records+" Records";
       }
   }
   else if(ctype=='mktg_segments_list'){
       var segment_id = '';
       if($('#single_user_id').val()>0) {
          segment_id= $('#single_user_id').val();
       }
       var data = $('#segmentManager').serializeArray();
       if (typeof segment_id !='undefined' && segment_id!=''){
           data.push({name: "segment_id", value: segment_id});
           all_records = total_count = '';
           all_records = $('#segment_'+segment_id).find('td:nth-child(6)').text(); //$('#total_unique_email_'+segment_id).val();
           total_count= "Total "+all_records+" Records";
       }
   }
   else if(ctype=='userleads') {
       var data = $('#FilterLeadForm').serializeArray();
   }else if(ctype=='examComm') {
       var data = $('#ExamForm').serializeArray();
   }else{
       $('#listloader').hide();
       alertPopup('We are not able to process your request right now. Please refresh the page and try again. In case, you face the issue again, get in touch with your dedicated Account Manager.','error');
       return;
   }

   data.push({name: "total_count", value: total_count});
   data.push({name: "all_records", value: all_records});
   data.push({name: "ctype", value: ctype});
   data.push({name: "list_manager_id", value: list_manager_id});
    $.ajax({
       url: '/communications/bulk-sms-communication',
       type: 'post',
       dataType: 'html',
       data: data,
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       success: function (data) {
           $('#bulk_communication_html').html(data);
           if(ctype == 'assessment_score'){
               $(".schedule_div").hide();
               $(".btn-testMail").hide();
           }
           //$.material.init();
           $('div.loader-block').hide();
           floatableLabel();
           browseWidget();
           if (document.documentElement.clientWidth > 992) {
               $('#bulk_communication_html [data-toggle="tooltip"]').tooltip({
                   placement: 'top',
                   trigger : 'hover',
                   template: '<div class="tooltip layerTop" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
               });
           }
           $('#bulkloader').hide();
           $('#listloader').hide();

           $("#schedule_button").hide();
           $("#commSubmitBtn").show();
           $("#SMSTextArea").attr('disabled','disabled');
           //$('#bulk_communication_action li:nth-child(2)').find('span').html('Bulk SMS');
           if(ctype!='' && (ctype=='mktg_leads_list' || ctype=='mktg_leads' || ctype=='mktg_segments_list' || ctype=='mktg_segments') ) {
               //If single id is selected then set text to Single Email/SMS
               if($('#to_mobile').length>0) {
                       var totalSMS=parseInt($('#to_mobile').val());
                       if(totalSMS==1) {
                           //$('#bulk_communication_action li:nth-child(2)').find('span').html('Single SMS');
                       }

               }
           }
           //console.log(data);
       },
       error: function (xhr, ajaxOptions, thrownError) {
           //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function bulkVoiceSmsCommunication(ctype){
   $('div.loader-block').hide();
   $('#bulkloader').show();
   if(ctype=='applications'){
       var data = $('#FilterApplicationForms').serializeArray();
   }
   else if(ctype=='userleads') {
       var data = $('#FilterLeadForm').serializeArray();
   }
   else{
       $('#listloader').hide();
       alertPopup('We are not able to process your request right now. Please refresh the page and try again. In case, you face the issue again, get in touch with your dedicated Account Manager.','error');
       return;
   }
   var total_count = $('#tot_records').text();
   data.push({name: "total_count", value: total_count});
   data.push({name: "ctype", value: ctype});
    $.ajax({
       url: '/communications/bulk-voice-sms-communication',
       type: 'post',
       dataType: 'html',
       //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
       data: data,
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       success: function (data) {

           $('#bulk_communication_html').html(data);
           //$.material.init();
           $('div.loader-block').hide();

           //console.log(data);
       },
       error: function (xhr, ajaxOptions, thrownError) {
           //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function sendBulkVsms(FilterLeadFormData, templateId) {
   $('#CommunicationBulkAction div.loader-block').show();
    $.ajax({
       url: '/communications/bulk-voice-sms-communication-send',
       type: 'post',
       dataType: 'json',
       data:  'FilterLeadFormData='+FilterLeadFormData+'&templateId='+templateId,
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       success: function (data) {
           if (data['status'] == 1) {

               $('#dispsuccess').show();
               $('#disperror').hide();

               $('#disperror').html('');
               $('#dispsuccess').html('Communication Request for VSMS saved successfully.');
               $('#bulkVsmsSendBtn').html("Sent");
           }else{

               $('#dispsuccess').hide();
               $('#disperror').show();

               $('#bulkVsmsSendBtn').removeAttr("disabled");
               $('#dispsuccess').html('');
               $('#disperror').html('Some Error in sending VSMS, please try again later.');
           }
           $('div.loader-block').hide();
           return false;
       },
       error: function (xhr, ajaxOptions, thrownError) {
           //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });

}


function communicationSelectAll(elem){
   $('div.loader-block').show();
//    console.log(elem.checked);
   if(elem.checked){
       //console.log(elem.checked);
       $('.select_users').each(function(){
           this.checked = true;
       });
       if(jsVars.counsellorOrStaffUser){
           $("#li_bulkCommunicationAction").show();
       }
   }else{
       $('.select_users').attr('checked',false);
   }

   $('div.loader-block').hide();
}

$(document).on('click', '.select_users',function(e) {

   if($('.select_users:checked').length<=1){
       $('#li_bulkCommunicationAction').hide();
   }else{
       $('#li_bulkCommunicationAction').show();
   }
   $('#select_all').attr('checked',false);

});

// for ck editor
$.fn.modal.Constructor.prototype.enforceFocus = function() {
 modal_this = this
 $(document).on('shown.bs.modal', function (e) {
   if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length
   && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select')
   && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
     modal_this.$element.focus()
   }
 })
};

function smsTokens(elem,id){
   var $SMSTextArea = $("#"+id);
   switch (elem.name) {
       case "machineKeys":
           if(this.value!=''){
               $SMSTextArea.replaceSelectedText("{{" + elem.value + "}}", "collapseToEnd");
           }
       break;
   }
   $SMSTextArea.focus();

       // For IE, which always shifts the focus onto the button
   window.setTimeout(function () {
       $SMSTextArea.focus();
   }, 0);

   return false;
}

function whatsappTokens(elem,id){
   var $WhatsAppTextArea = $("#"+id);
   switch (elem.name) {
       case "whatsAppmachineKeys":
           if(this.value!=''){
               $WhatsAppTextArea.replaceSelectedText("{{" + elem.value + "}}", "collapseToEnd");
           }
       break;
   }
   $WhatsAppTextArea.focus();

       // For IE, which always shifts the focus onto the button
   window.setTimeout(function () {
       $WhatsAppTextArea.focus();
   }, 0);

   return false;
}

function checkPermissionOpenCommWindow(user_id,form_id,ctype,college_id){
       //NPF-1211 10.3 || LMS & Application Manager revamp
      if(typeof ctype == 'undefined'){
          ctype ='';
      }
      if(typeof college_id == 'undefined'){
          college_id ='';
      }
       $('.comtab').removeClass('active');
//        console.log(jsVars.PermissionList);
       if(typeof jsVars.PermissionList['communicationEmail'] !='undefined' && jsVars.PermissionList['communicationEmail']==true){
           $('.html_communicationEmail').addClass('active');
           communicationEmail(user_id,form_id,ctype,college_id);
       }else if(typeof jsVars.PermissionList['communicationComment'] !='undefined' && jsVars.PermissionList['communicationComment']==true){
           $('.html_communicationComment').addClass('active');
           communicationComment(user_id,form_id,ctype,college_id);
       }else if(typeof jsVars.PermissionList['communicationSms'] !='undefined' && jsVars.PermissionList['communicationSms']==true){
           $('.html_communicationSms').addClass('active');
           communicationSms(user_id,form_id,ctype,college_id);
       }else if(typeof jsVars.PermissionList['communicationWhatsapp'] !='undefined' && jsVars.PermissionList['communicationWhatsapp']==true){
           $('.html_communicationWhatsApp').addClass('active');
           communicationWhatsApp(user_id,form_id,ctype,college_id,'whatsapp');
       }
}

/**
* This function will either show the preview of selected content or send test email from communication pop up as per assigned email
* as per passed parameter
* @returns {undefined}
*/
function previewOrsendTestEmail(ctype,preview){
   if(typeof preview == 'undefined') {
       preview='';
   }
   var error='';
   if($.trim($('#subject').val())=='') {
       error+="Please enter subject.<br />";
   }

   if($('#appUnlayerIframeDiv').length > 0  && !$('#appUnlayerIframeDiv').is(':hidden')) {
       if(unlayerTemplateText == '') error+="Please enter message body.<br />";
   } else if($('#editor-container').is(':hidden') && typeof CKEDITOR.instances['editor'] == 'undefined') {
       error+="Please enter message body.<br />";
   } else if($('#editor-container').is(':hidden') && typeof CKEDITOR.instances['editor'] !='undefined' && $.trim(CKEDITOR.instances['editor'].getData())=='') {
       error+="Please enter message body.<br />";
   }

   if(preview == 'email') {
       if($.trim($('#test_email_id').val())=='') {
           error+="Please enter test email id.<br />";
       } else if(ValidateEmailAddress($.trim($('#test_email_id').val())) === false) {
           error+="Please enter a valid test email id.<br />";
       }
   }

   if(preview == 'email_preview' && $('#appUnlayerIframeDiv').length > 0  && !$('#appUnlayerIframeDiv').is(':hidden')) {
       $("body, html").animate({ scrollTop: $('#appMessageBox').offset().top}, 1000);
       $(".app-iframe-preview").contents().scrollTop(0);
       $('#appMessageLabel').css('background-color','#FFFAAE');
       setTimeout(function() {
           $('#appMessageLabel').css('background-color','#FFFFFF');
       }, 1500);
       return false;
   }

   if(error!='') {
       alertPopup(error,'error');
       return false;
   }

   $('#disperror').hide();
   $('#dispsuccess').hide();

   $('div.loader-block').show();
   if(preview=='') {
       $('#text_email_id_btn').attr('disabled','disabled');
   }

   var data='';
   switch(ctype){
       case 'leads_list':
       case 'applications_list':
           data = $('#BulkEmailCommunication, #listManager').serialize();
           break;
       case 'mktg_leads':
       case 'mktg_segments':
           data = $('#BulkEmailCommunication, #manageContacts').serialize();
           break;
       case 'mktg_leads_list':
           data = $('#BulkEmailCommunication, #listManager').serialize();
           break;
       case 'mktg_segments_list':
       case 'leads_segments':
           data = $('#BulkEmailCommunication, #segmentManager').serialize();
           break;
       case 'userleads':
           data = $('#BulkEmailCommunication, #FilterLeadForm').serialize();
           break;
       case 'applications':
           data = $('#BulkEmailCommunication, #FilterApplicationForms').serialize();
           break;
       case 'examComm':
           data = $('#BulkEmailCommunication, #ExamForm').serialize();
           break;
       case 'assessment_score':
           var data = $('#BulkEmailCommunication, #assessmentListingFormMain').serialize();

           break;
   }
   data=data+'&preview='+preview;
   if($('#appUnlayerIframeDiv').length > 0  && !$('#appUnlayerIframeDiv').is(':hidden')) {
       data=data+'&body_content='+encodeURIComponent(unlayerTemplateText);
       sendPreviewCommunicationRequest(data, preview);
   } else if($('#editor-container').is(':hidden')) {
       if(typeof CKEDITOR.instances['editor'] != 'undefined')  {
           data=data+'&body_content='+encodeURIComponent(CKEDITOR.instances['editor'].getData());
           sendPreviewCommunicationRequest(data, preview);
       }
   } else {
       unlayer.exportHtml(function(data1) {
           data=data+'&body_content='+encodeURIComponent(data1.html);
           sendPreviewCommunicationRequest(data, preview);
       });
   }
}

function sendPreviewCommunicationRequest(data, preview) {
   $.ajax({
       url: '/communications/send-test-email-and-sms',
       type: 'post',
       dataType: 'json',
       data: data,
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       success: function (json) {
           if(typeof json['session_logout'] != 'undefined') {
               if(typeof json['redirect'] != 'undefined'){
                   window.location.href = json['redirect'];
               }else{
                   window.location.href='/';
               }
           }
           else if(typeof json.error != 'undefined' && json.error!=''){
               $(".modal-content").animate({ scrollTop: 0}, 1000);
               $('#dispsuccess').html('');
               $('#disperror').show();
               $('#dispsuccess').hide();
               $('#disperror').html(json.error);
               $('.modalLoader, #listloader').hide();
               $('.modalLoader').css('position', 'absolute');
               return false;
           }

           //$('#bulk_communication_html').html(json);
           //$.material.init();
           $('div.loader-block').hide();
           $('#bulkloader').hide();
           

           if(preview=='') {
               $('#text_email_id_btn').removeAttr('disabled');
           }

           if(typeof json['data'] != 'undefined' && json['data']!='') {
               if(preview == 'email_preview') {
                   $('#communicationPreviewModal').addClass('modalWide');
//                    $('#communicationPreviewModal > .modal-dialog').css("width","100%");
                   $('#communicationPreviewModal > div > div > div > h2.modal-title').html('Email Preview');
                   $('#showCommunicationPreviewContainer').html(stripslashes(json['data']));
                   $("#communicationPreviewModal").modal();
               } else if (preview == 'email') {
                   alertPopup(json['data'],'success');
               }
           }
           
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

/*
* This function will send test sms from communication pop up as per assigned email
*/
function sendTestMsgPopup(ctype,preview){
   if(typeof preview !=  'undefined' && preview == 'sms') {
       $('#ConfirmMsgBody').html('Please Send out a Test SMS before sending out the Actual campaigns​.');
       $('#confirmYes').unbind('click');
       $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false}).off('click', '#confirmYes').on('click', '#confirmYes', function (e) {
           $('#ConfirmPopupArea').modal('hide');
           previewOrsendTestSMS(ctype,preview);
       });
   }else{
       previewOrsendTestSMS(ctype,preview);
   }
}

function previewOrsendTestSMS(ctype,preview){

   if(typeof preview == 'undefined') {
       preview='';
   }

   var error='';
   if ((preview == 'notification_preview') && ($.trim($('#NotificationTitleArea').val()) == '')) {
       error += "Please enter notification title.<br />";
   } if ((preview == 'notification_preview') && ($.trim($('#NotificationTextArea').val()) == '')) {
       error += "Please enter notification message.<br />";
   } else if ((preview != 'notification_preview')  && ($.trim($('#SMSTextArea').val()) == '')) {
       error += "&bull;&nbsp;Please enter message body.&nbsp;&nbsp;";
   }

   if(preview == 'sms') {
       if($.trim($('#test_sms_id').val())=='') {
           error+="Please enter mobile number.";
       }
   }

   /*else if(ValidateEmailAddress($.trim($('#test_email_id').val())) === false) {
       error+="Please enter a valid test email id.<br />";
   }*/

   if(error!='') {
       // alertPopup(error,'error');
       $('#test_error').show().html(error);
       return false;
   }

   $('#test_error').hide();
   $('#disperror').hide();
   $('#test_success').hide();
   $('#dispsuccess').hide();

   $('div.loader-block').show();
   $('#text_email_id_btn').attr('disabled','disabled');
   var data='';
   switch(ctype){
       case 'leads_list':
       case 'applications_list':
           data = $('#bulkSmsCommunication, #listManager').serialize();
           break;
       case 'mktg_leads':
       case 'mktg_segments':
           data = $('#bulkSmsCommunication, #manageContacts').serialize();
           break;
       case 'mktg_leads_list':
           data = $('#bulkSmsCommunication, #listManager').serialize();
           break;
       case 'mktg_segments_list':
       case 'leads_segments':
           data = $('#bulkSmsCommunication, #segmentManager').serialize();
           break;
       case 'userleads':
           data = $('#bulkSmsCommunication, #FilterLeadForm').serialize();
           break;
       case 'applications':
           if (preview == 'notification_preview') {
               data = $('#bulkNotificationCommunication, #FilterApplicationForms').serialize();
           } else {
               data = $('#bulkSmsCommunication, #FilterApplicationForms').serialize();
           }
           break;
       case 'examComm':
           if (preview === 'sms' || preview === 'sms_preview') {
               data = $('#bulkSmsCommunication, #ExamForm').serialize();
           } else {
               data = $('#BulkEmailCommunication, #ExamForm').serialize();
           }
           break;
       case 'assessment_score':
           if (preview === 'sms' || preview === 'sms_preview') {
               data = $('#bulkSmsCommunication, #assessmentListingFormMain').serialize();
           } else {
               data = $('#BulkEmailCommunication, #assessmentListingFormMain').serialize();
           }
           var arr = $('.select_users:checked').map(function(){
               return this.value;
           }).get();
           //data.push({name: "selected_users", value: arr});
           break;
   }

   if (preview == 'notification_preview') {
       data = data + '&notification_title=' + encodeURIComponent($.trim($('#NotificationTitleArea').val()));
       data = data + '&body_content=' + encodeURIComponent($.trim($('#NotificationTextArea').val()));
   } else {
       data = data + '&body_content=' + encodeURIComponent($.trim($('#SMSTextArea').val()));
   }

   data=data+'&preview='+preview;

    $.ajax({
       url: '/communications/send-test-email-and-sms',
       type: 'post',
       dataType: 'json',
       data: data,
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       success: function (json) {
           if(typeof json['session_logout'] !='undefined') {
               if(typeof json['redirect'] != 'undefined'){
                   window.location.href = json['redirect'];
               }else{
                   window.location.href='/';
               }
           }
           if(preview=='') {
               $('#text_email_id_btn').removeAttr('disabled');
           }
           //$.material.init();
           $('div.loader-block').hide();
           $('#bulkloader').hide();
           if(typeof json['error'] != 'undefined' && json['error']!='') {
               $('#test_error').show().html(json['error']);
           } else if(typeof json['data'] != 'undefined' && json['data']!='') {
               if(preview == 'notification_preview') {
                   $('#communicationPreviewModal > .modal-dialog').css("width","56%");
                   $('#communicationPreviewModal > div > div > div > h2.modal-title').html('Notification Preview');
                   $('#showCommunicationPreviewContainer').html(json['data']);
                   $("#communicationPreviewModal").modal();
               } else if(preview == 'sms_preview') {
                   $('#communicationPreviewModal > .modal-dialog').css("width","56%");
                   $('#communicationPreviewModal > div > div > div > h2.modal-title').html('SMS Preview');
                   $('#showCommunicationPreviewContainer').html(json['data']);
                   $("#communicationPreviewModal").modal();
               } else if(preview == 'sms') {
                   $('#test_success').show().html(json['data']);
               }
           }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function singleCrmApplicationCommunicationWindow(user_id,form_id,fd_id,ctype,college_id){
   $('#fdid').val(fd_id);
   singleCommunicationWindow(user_id,form_id,ctype,college_id);
}
/**
* lead single communication
* @param {type} user_id
* @param {type} form_id
* @param {type} ctype
* @param {type} college_id
* @returns {undefined}
*/
function singleCommunicationWindow(user_id,form_id,ctype,college_id){
   //display_popup = true;
  if(typeof jsVars.PermissionList == 'string'){
      jsVars.PermissionList    = $.parseJSON(jsVars.PermissionList);
  }
  if(typeof jsVars.PermissionList['communicationEmail'] !='undefined' && jsVars.PermissionList['communicationEmail']==true){
       $('#CommunicationSingleAction').modal();
       $('#CommunicationSingleAction #alertTitle').text('Single Communication')
       addheader(user_id,form_id,ctype,college_id);
       $('.html_communicationEmail').addClass('active');
       communicationEmail(user_id,form_id,ctype,college_id);
   }else if(typeof jsVars.PermissionList['communicationComment'] !='undefined' && jsVars.PermissionList['communicationComment']==true){
       $('#CommunicationSingleAction').modal();
       $('#CommunicationSingleAction #alertTitle').text('Single Communication')
       addheader(user_id,form_id,ctype,college_id);
       $('.html_communicationComment').addClass('active');
       communicationComment(user_id,form_id,ctype,college_id);
   }else if(typeof jsVars.PermissionList['communicationSms'] !='undefined' && jsVars.PermissionList['communicationSms']==true){
       $('#CommunicationSingleAction').modal();
       $('#CommunicationSingleAction #alertTitle').text('Single Communication')
       addheader(user_id,form_id,ctype,college_id);
       $('.html_communicationSms').addClass('active');
       communicationSms(user_id,form_id,ctype,college_id);
   }else if(typeof jsVars.PermissionList['communicationWhatsApp'] !='undefined' && jsVars.PermissionList['communicationWhatsApp']==true){
       $('#CommunicationSingleAction').modal();
       $('#CommunicationSingleAction #alertTitle').text('Single Communication')
       addheader(user_id,form_id,ctype,college_id);
       $('.html_communicationWhatsApp').addClass('active');
       communicationWhatsApp(user_id,form_id,ctype,college_id,'whatsapp');
   }else{
       return false;
   }
}

/**
* lead single communication whatsapp
* @param {type} user_id
* @param {type} form_id
* @param {type} ctype
* @param {type} college_id
* @returns {undefined}
*/
function ClickToWhatsApp(user_id,form_id,ctype,college_id){
   //display_popup = true;
  if(typeof jsVars.PermissionList == 'string'){
      jsVars.PermissionList    = $.parseJSON(jsVars.PermissionList);
  }
  console.log(jsVars.PermissionList['communicationWhatsapp']);
   if(typeof jsVars.PermissionList['communicationWhatsapp'] !='undefined' && jsVars.PermissionList['communicationWhatsapp']==true){
       $('#CommunicationSingleAction').modal();
       addheader(user_id,form_id,ctype,college_id);
       $('.html_communicationWhatsApp').addClass('active');
       communicationWhatsApp(user_id,form_id,ctype,college_id,'whatsapp');
   }
}



/**
* adding header in the case of lead single communication
* @param {type} user_id
* @param {type} form_id
* @param {type} ctype
* @param {type} college_id
* @returns {undefined}
*/
function addheader(user_id,form_id,ctype,college_id){
   $.ajax({
       cache: false,
       url: '/communications/single-communication-header',
       type: 'post',
       data: {'user_id':user_id,'form_id':form_id,'ctype':ctype,'college_id':college_id},
       dataType: 'html',
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function() {
           $('.modalLoader').show();
       },
       complete: function() {
           //$('.modalLoader').hide();
       },
       success: function (response) {
           $('#addheader').html(response);
           $('.communicationEmail').addClass('active');
           $('.modalLoader').hide();
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
//            $('#contact-us-final div.loader-block').hide();
       }
   });
}


//Return SMS channel Sender list
function getSmsChannelSender(channel, college_id, user_id,selectedTemplate='') {
   var form_id = $("#form_id").val();
   var ctype = $("#ctype").val();
   var default_sms_template = $("#default_sms_template").val();
   var am_single_form_id = $("#am_single_form_id").val();
   if(selectedTemplate == ''){
       var selectedTemplate = $("#smsTemplateList").val();
   }
   if(channel == 'numerical'){
       //$('#numerical_channel_error').html('As Per Trai Regulations No Delivery Report will be available for SMS which are sent out using the Promotional (Numerical) Channel')
       $("select[name='sms_channel']").closest('div').append("<div id='numerical_senderId_message' style='color:red;'>As per Trai regulations no delivery report will be available for SMS sent using the Promotional ( Numeric ) Channel.</div>");
   }else{
       $('#numerical_senderId_message').remove()
   }
   $.ajax({
       cache: false,
       url: '/communications/communication-sms-sender',
       type: 'post',
      data: {'college_id':college_id, 'channel':channel, 'user_id':user_id,'form_id':form_id,'ctype':ctype,'default_sms_template':default_sms_template,'am_single_form_id':am_single_form_id},
       dataType: 'json',
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function() {
           $('.modalLoader').show();
       },
       complete: function() {
           $('.modalLoader').hide();
       },
       success: function (json) {
           $('.modalLoader').hide();
           if(json['redirect']) {
               location = json['redirect'];
           }
           else if(json['error']) {
               alert(json['error'],'error');
           }
           else if(json['success'] == 200) {
               if(json['nationalSender']) {
                   $('select#nationalSender').html(json['nationalSender']);
               }

               if(json['internationalSender']) {
                   $('select#internationalSender').html(json['internationalSender']);
               }
               if(json['smsTemplateList']){
                   $('select#smsTemplateList').html(json['smsTemplateList']);
                   $('select#smsTemplateList').val(selectedTemplate);
               }

               $('.chosen-select').trigger('chosen:updated');
           }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function getWhatsappChannelSender(configtype, college_id, user_id) {
    $.ajax({
        cache: false,
        url: jsVars.FULL_URL+'/communications/communication-whatsapp-sender',
        type: 'post',
        data: {'college_id':college_id, 'config_type':configtype, 'user_id':user_id},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('.modalLoader').show();
        },
        complete: function() {
            $('.modalLoader').hide();
        },
        success: function (json) {
            var htmlNationalOption = '';
            var htmlinterNationalOption = '';
            $('.modalLoader').hide();
            if (json['message'] === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }
            else if(json['status'] == 200) {
                var nationalSelected = "";
                var interSelected = "";

                if(configtype == null || configtype == '' || configtype == 'whatsapp_national_config'){
                    nationalSelected = 'selected="selected"';
                }
                else if(typeof configtype != 'undefined' && configtype == 'whatsapp_international_config'){
                    interSelected = 'selected="selected"';
                }

                if(typeof json['nationalSenderList'] !='undefined' && json['nationalSenderList']) {
                    htmlNationalOption = '<option value="">Select National Sender</option>';
                    var i=0;
                    $.each(json['nationalSenderList'], function (index, item) {
                        if(i==0){
                            htmlNationalOption +='<option value="'+index+'" '+nationalSelected+'>'+item+'</option>';
                        }
                        else{
                            htmlNationalOption +='<option value="'+index+'">'+item+'</option>';
                        }
                        i++;
                    });
                    $('select#nationalSender').html(htmlNationalOption);
                    if(nationalSelected !== ''){
                      $("select#nationalSender").trigger('change');
                    }
//                    setTimeout(function(){
//                    },1000);
                }

                if(typeof json['internationalSenderList'] != 'undefined' && json['internationalSenderList']) {
                    var htmlinterNationalOption = '<option value="">Select International Sender</option>';
                    var j = 0;
                    $.each(json['internationalSenderList'], function (index, item) {
                        if(j==0){
                            htmlinterNationalOption +='<option value="'+index+'" '+interSelected+'>'+item+'</option>';
                        }
                        else{
                            htmlinterNationalOption +='<option value="'+index+'">'+item+'</option>';
                        }
                        j++;
                    });
                    $('select#internationalSender').html(htmlinterNationalOption);
                    if(typeof interSelected != 'undefined' && interSelected !='' ){
                        $("select#internationalSender").trigger('change');
//                        setTimeout(function(){
//                        },1000);
                    }
                }

                $('.chosen-select').trigger('chosen:updated');
            }else if(json['message']){
                alertPopup(json['message'],'error');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function showHideEmailCommDiv(show_div){
   $('.conditionalDiv').hide();
    $(".schedule_div").removeClass("active");
   $('.attachmentFile').fadeOut();
   if(show_div!=''){
       $('.btn-blank').removeClass('active');
       $('.'+show_div).toggleClass('active');
   }
   $('#test_email_id, #scheduled_time').val("");
   if(show_div!='')$('#'+show_div).fadeIn();
   $('.dependentBox').show().removeClass('fadeIn').addClass('fadeIn');
   if( ($('.conditionalDiv:visible').length == 0) && ($('#recurring_communication:visible').length == 0) ){
       $('.dependentBox').removeClass('fadeIn').hide();
   }
   //$("#CommunicationBulkAction .modal-content").animate({ scrollTop: $('.dependentBox').offset().top}, 1000);

   $("#schedule_button").hide();
   $("#TemplateCreationSubmitBtn1").show();
   if(show_div =='schedule_div'){
       $("#schedule_button").show();
       $("#TemplateCreationSubmitBtn1").hide();
   }

   if(show_div =='testemail_div'){
       $("#CommunicationBulkAction .modal-content").animate({ scrollTop: $('.dependentBox').offset().top}, 200);
   }

}

function showHideSMSCommDiv(show_div){
   $('.conditionalDiv').hide();
   $('.attachmentFile').fadeOut();
   if(show_div!=''){
       $('.btn-blank').removeClass('active');
       $('.'+show_div).toggleClass('active');
   }
   $('#test_sms_id, #scheduled_time').val("");
   $('#test_error, #test_success').html("").hide();
   if(show_div!='')$('#'+show_div).fadeIn();
   $('.dependentBox').show().removeClass('fadeIn').addClass('fadeIn');
   if( ($('.conditionalDiv:visible').length == 0) && ($('#recurring_communication:visible').length == 0) ){
       $('.dependentBox').removeClass('fadeIn').hide();
   }
   //$("#CommunicationBulkAction .modal-content").animate({ scrollTop: $('.dependentBox').offset().top}, 1000);

   $("#schedule_button").hide();
   $("#commSubmitBtn").show();
   if(show_div =='schedule_sms_div'){
       $("#schedule_button").show();
       $("#commSubmitBtn").hide();
   }
}

function showHideWhatsappCommDiv(show_div){
   $('.conditionalDiv').hide();
   $('.attachmentFile').fadeOut();
   if(show_div!=''){
       $('.btn-blank').removeClass('active');
       $('.'+show_div).toggleClass('active');
   }
   $('#test_whatsapp_id, #scheduled_time').val("");
   if(show_div!='')$('#'+show_div).fadeIn();
   $('.dependentBox').show().removeClass('fadeIn').addClass('fadeIn');
   if( ($('.conditionalDiv:visible').length == 0) && ($('#recurring_communication:visible').length == 0) ){
       $('.dependentBox').removeClass('fadeIn').hide();
   }
       //$("#CommunicationBulkAction .modal-content").animate({ scrollTop: $('.dependentBox').offset().top}, 1000);
   $('#text_whatsapp_id_btn').removeAttr('disabled');
   $('#test_wa_error, #test_wa_success').html('').hide();
   $("#schedule_button").hide();
   $("#commSubmitBtn").show();
   if(show_div =='schedule_whatsapp_div'){
       $("#schedule_button").show();
       $("#commSubmitBtn").hide();
   }
}

function setSingleValue(value, listManagerId){
   $('#single_user_id').val(value);
   //used in list manager page
   if ($('input#list_manager_id').length > 0) {
       $('input#list_manager_id').val('');
       if ((typeof listManagerId != 'undefined') && (listManagerId > 0)) {
           $('input#list_manager_id').val(listManagerId);
       }
   }
}


if($("#li_bulkCommunicationAction").length>0){
   $("#li_bulkCommunicationAction").on('click',function(){
       $('#single_user_id').val('');
   });
}

function ValidateEmailAddress(email) {
   var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

   if (!filter.test(email)) {
      return false;
   }
   return true;
}

if (('#communicationTemplateApplicable').length > 0) {
   $(document).on('click', '#communicationTemplateApplicable', function (e) {
       e.preventDefault();

           $("#ConfirmPopupArea p#ConfirmMsgBody").html('<p>Make sure that you have entered the college name at the end of the SMS body, as shown in the sample text in the Notes.</p><p>"Templates Applicable Field" cannot be edited once saved. Are you sure you want to proceed?</p>');
           //$('#ChangeStatusSuccessArea p#ConfirmDisableEnableFormPopUpTextArea').text('Communication Template has been copied.');
           $("#ConfirmPopupArea a#confirmYes").attr("onclick", "submitTemplateForms();");
           $("#ConfirmPopupArea button").attr('onclick', "refreshApplicablefor()");

   });

}
$('#TemplateCreateSubmitBtn').on('click', function(event) {
       var textContent = $("#WhatsAppBusinessTextArea").val();

   if(textContent.length>1500){
       $("#content_error").html('Max character is 1500 character.');
       return false;
   }

   event.preventDefault();
   var error = validateWhatsappBusinessTemplate();
   var pipe_error = pipeValidation($('#TemplateTitleInput').val(),'TemplateTitleInput');
   if(pipe_error==false){
       return;
   }
//   if(error === true){
//       return;
//   }


   $("#ConfirmPopupArea a#confirmYes").prop('disabled', false);
   if($('#applicable-for-read-only').length > 0 && $('#applicable-for-read-only').attr('disabled') == 'disabled') {
       submitTemplateForms();
   } else if(typeof jsVars.loadInIframe !== 'undefined' && jsVars.loadInIframe === 1) {
       submitTemplateForms();
   } else {
       var templateType = $("#template-type").val();
       var htmlData = '';
       if(templateType === 'sms'){
           htmlData += '<p>Make sure that you have entered the college name at the end of the SMS body, as shown in the sample text in the Notes.</p>';
       }
       htmlData += '<p>"Templates Applicable Field" cannot be edited once saved. Are you sure you want to proceed?</p>';
       $("#ConfirmPopupArea p#ConfirmMsgBody").html(htmlData);
       $("#ConfirmPopupArea a#confirmYes").attr("onclick", "submitTemplateForms();");
       $("#ConfirmPopupArea").modal('show');
   }
});

function onChangeApplicableToken(e,templatetype=null,source='') {
   var form_id = '';
       if(e=='widgets' || e=='leads' || e=='raw_data') {
           $("#formdiv").hide();
           //$("#FormIdSelect").prop('disabled', true).trigger("chosen:updated");
           $("#FormIdSelect").selected = false;
           $("#FormIdSelect").val('').trigger("chosen:updated");
       } else {
           $("#FormIdSelect").prop('disabled', false).trigger("chosen:updated");
           form_id = $("#FormIdSelect").val();
           $("#formdiv").show();
       }
       if(jsVars.loadInIframe !== 'undefined' && jsVars.loadInIframe ===1) {
           $("#formdiv").hide();
       }
       var college_id = $("#CollegeIdSelect").val();

       var template_key = jsVars.template_key;

       var templateType = templatetype;

       var templateFor='';
       if( $("#TemplateTypeSelect").length ){
           templateFor = $("#TemplateTypeSelect").val();
       }

       displayWhatsappAttachmentDocumentList();
       if(templatetype=='whatsapp_business' && source === ''){
            return false;
       }

       if(e=='applications' || e=='post_application'){
           if ($('#FormIdSelect').val()!==''){
               var FormId = $('#FormIdSelect').val();
               GetCollegeNFormMachineKeyList(college_id,FormId);
           }else{
               GetCollegeNFormMachineKeyList(college_id,0);
           }
           return false;
       }
       $.ajax({
           cache: false,
           url: '/communications/changeToken',
           type: 'post',
           data: {'applicable_type':e, 'college_id': college_id, 'form_id':form_id, 'template_for_email_sms' : templateFor ,'template_type' : templateType},
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
                   if (typeof(CKEDITOR) != "undefined"){
                       for(name in CKEDITOR.instances){
                           CKEDITOR.instances[name].destroy()
                       }
                   }
                   initCKEditor(eval(responseObject['data']['newtoken']));

                   var html = '<option value=""></option>';
                   jQuery.each(responseObject['data']['newtokenlist'], function (index, category) {
                       if(category !== ''){
                           html += '<optgroup label='+index+'>';
                           jQuery.each(category, function (index, value) {
                               html+= '<option value="'+index+'">'+value+'</option>';
                           });
                       }
                   });

                   if(typeof responseObject['data']['staticTokens'] !== 'undefined' && responseObject['data']['staticTokens']!==''){
                       html += '<optgroup label="Static Tokens">';
                       jQuery.each(responseObject['data']['staticTokens'], function (index, value) {
                           html+= '<option value="'+index+'">'+value+'</option>';
                       });
                   }
                   $("#SMSMappingSeletct").html(html).trigger("chosen:updated");
                   $('#WhatsAppMappingSelect').html(html).trigger('chosen:updated');
                   $("#EmailMappingSeletct").html(html).trigger('chosen:updated');

                   if ($('#NotificationMappingSeletct').length > 0) {
                       $("#NotificationMappingSeletct").html(html).trigger("chosen:updated");
                   }
                   if ($('#WhatsAppBusinessMappingSelect').length > 0) {
                       $("#WhatsAppBusinessMappingSelect").html(html);
                       $("#WhatsAppBusinessMappingSelect").trigger("chosen:updated");
                   }
                   popTokenList(html);
               }else{
                   //alertPopup(responseObject.message, 'error');
               }
           },
           error: function (xhr, ajaxOptions, thrownError) {
               console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           }
       });

}

function submitTemplateForms() {
   $("#ConfirmPopupArea a#confirmYes").prop('disabled', true);
   $("#ConfirmPopupArea").modal('hide');
   $('div.loader-block').show();
   $("#TemplateCreationForm").submit();
}

function checkOtherCCSelect(elem,toemailsms){
   if(($('#to_email').length>0 && $('#cc_email').length>0) && ($('#to_email').val()==$('#cc_email').val())){
       $('.ccMailCondation').html('CC Email cannot be same as To email');
       //alertPopup('CC Email cannot be same as To email','error');
       $("#"+toemailsms).val('');
       $("#"+toemailsms).trigger("chosen:updated");
   }

   if($('#cc_email').length>0 && $('#cc_email').val().toLowerCase()=='other'){
       $('.ccMailCondation').html('');
       $('#cc_email_other_div').show();
       floatableLabel();
   }
   else{
       $('#cc_email_other_div').hide();
       $('#cc_email_other_div').val('');
   }
}
$(document).on('keyup', '#SMSTextArea', function () {
   charcterCount();
});

function charcterCount(){
   var text = $('#SMSTextArea').val();
   var text = text.replace(/\{{.*?\}}/g, "");
   text = text.replace(/ +(?= )/g,'');
   var text_length = text.length;
   var character_length = text_length;
   if(text_length > 0){
       var specialChar = ["^", "{", "}", "\\", "[", "~", "]", "|", "â‚¬"];
       for (var i = 0; i < text_length; i++) {
           var ch = text.charAt(i);
           if (specialChar.indexOf(ch) !== -1) {
               character_length++;
           }
       }
   $('#SMSTextArea_charCount').html(character_length + ' characters');
   $('[data-toggle="popover"]').popover();
   $('#SMSTextArea_tooltip').show();
   }else{
   $('#SMSTextArea_charCount').html('');
   $('#SMSTextArea_tooltip').hide();
   }
}

function communicationNotification(user_id, form_id, ctype, college_id) {
    
   var mlead = '';
   if (ctype == 'applications') {
       mlead = "applications";
   }
   $('#credit_info_msg_single').html('');
   $('#comm_action_html').html('');
//   $('div.loader-block').show();
   applicant_name = $('#applicantName').val();
   if (typeof applicant_name == 'undefined') {
       applicant_name = '';
   }
   $.ajax({
       cache: false,
       url: '/communications/communication-notification',
       type: 'post',
       data: {'user_id': user_id, 'form_id': form_id, 'applicant_name': applicant_name, 'ctype': mlead, 'college_id': college_id},
       dataType: 'html',
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function () {
           $('#graphStatsLoaderConrainer').show();
       },
       complete: function () {
           $('#graphStatsLoaderConrainer').hide();
       },
       success: function (response) {
           if(response == 'Permission Denied'){
               $('#comm_action_html').html('<div class="aligner-middle" style="margin:100px 0"><div class="text-center text-danger font16"><span class="draw-sad fa-2x"></span><br><span>Permission Denied</span></div></div>');
           }else{
               $('#comm_action_html').html(response);
           }
           $('div.loader-block').hide();
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });

   return;
}

function bulkNotificationCommunication(ctype) {

   $('.modalLoader').show();
   var total_count = $('#tot_records').text();
   var all_records = ($('#all_records_val').length > 0) ? $('#all_records_val').val() : 0;

   var data = {};
   if (ctype == 'applications') {
       data = $('#FilterApplicationForms').serializeArray();
   } else {
       $('.modalLoader').hide();
       alertPopup('We are not able to process your request right now. Please refresh the page and try again. In case, you face the issue again, get in touch with your dedicated Account Manager.', 'error');
       return;
   }
   data.push({name: "total_count", value: total_count});
   data.push({name: "all_records", value: all_records});
   data.push({name: "ctype", value: ctype});
   $.ajax({
       url: '/communications/bulk-notification-communication',
       type: 'post',
       dataType: 'html',
       data: data,
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       success: function (data) {
           if(data == 'Permission Denied'){
               $('#bulk_communication_html').html('<div class="aligner-middle"><div class="text-center text-danger font20"><span class="draw-sad fa-3x"></span><br><span>' + data + '</span></div></div>');
           }else{
               $('#bulk_communication_html').html(data);
           }
           //$.material.init();
           $('.modalLoader').hide();
           floatableLabel();
           //$('#bulk_communication_action li:nth-child(2)').find('span').html('Bulk SMS');
           if (ctype != '' && (ctype == 'mktg_leads_list' || ctype == 'mktg_leads' || ctype == 'mktg_segments_list' || ctype == 'mktg_segments')) {
               //If single id is selected then set text to Single Email/SMS
               if ($('#to_mobile').length > 0) {
                   var totalSMS = parseInt($('#to_mobile').val());
                   if (totalSMS == 1) {
                       //$('#bulk_communication_action li:nth-child(2)').find('span').html('Single SMS');
                   }

               }
           }
           //console.log(data);
       },
       error: function (xhr, ajaxOptions, thrownError) {
           //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

   function getRecurringCommunication(type){
       $("#isRecurring").prop("disabled",true);
       $(".schedule_div").removeClass("active");
       if(typeof type!='undefined' && type=="recurring"){
           showHideEmailCommDiv('');
           showHideSMSCommDiv('');
           var data = [];
           data.push({name: "type", value: type});
           $.ajax({
               url: '/communications/get-bulk-recurring-communication',
               type: 'post',
               dataType: 'html',
               async: true,
               data: data,
               headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
               beforeSend: function () {
                   $('.attachmentFile').fadeOut();
                   $('.btn-attachment').removeClass('active');
                   $('#modalLoaderDiv').show();
//					$('#isRecurring').prop("disabled", true);
               },
               complete: function () {
                   $('#modalLoaderDiv').hide();
                                       if($('#TemplateCreationSubmitBtn1').is(':disabled')===false){
                                           $(".schedule_div").prop("disabled",true);
                                       }
                   $('#isRecurring').prop("disabled", false);
               },
               success: function (data) {
                   if (data === "session_logout") {
                       window.location.href = jsVars.FULL_URL;
                   }else if(data == 'permission_denied'){
                       $('#recurring_communication').html('<div class="aligner-middle"><div class="text-center text-danger font20"><span class="draw-sad fa-3x"></span><br><span>' + data + '</span></div></div>');
                   }else{
                       $('#recurring_communication').fadeIn();
                       $('.comtoggleBox .blend-line').fadeIn();
                       $('#recurring_communication').html(data);
                       $('.testemail_div').removeClass('active');
                       $('.dependentBox').show().removeClass('fadeIn').addClass('fadeIn');
                       $("#CommunicationBulkAction .modal-content").animate({ scrollTop: $('.dependentBox').offset().top}, 200);
                   }
//                    $('.modalLoader').hide();
                   floatableLabel();
               },
               error: function (xhr, ajaxOptions, thrownError) {
                   console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
               }
           });
       }else{
           $('#recurring_communication').fadeOut();
           $('.comtoggleBox .blend-line').fadeOut();
           $('#recurring_communication').html('');
           $('.attachmentFile').fadeOut();
           $('.btn-attachment').removeClass('active');
           if($('.conditionalDiv:visible').length == 0){
               $('.dependentBox').removeClass('fadeIn').hide();
           }
           $("#CommunicationBulkAction .modal-content").animate({ scrollTop: $('.dependentBox').offset().top}, 200);
                       if($('#TemplateCreationSubmitBtn1').is(':disabled')===false){
                           $(".schedule_div").prop("disabled",false);
                       }
           $("#isRecurring").prop("disabled",false);

       }
   }

   function getRecurFreqInputs(){
       var recur_frequency = $("#recur_frequency option:selected").text().toLowerCase();
       $('#recur_date , #recur_day').val("");
       $('#recur_date_div, #recur_day_div, #recur_interval_div').hide();
       $("#recur_interval").html('').hide();
       if(recur_frequency=="monthly"){
           $('#recur_interval_div .floatify__label').text('Select Interval');
           $("#recur_date_div").show();
           $("#CommunicationBulkAction .modal-content").animate({ scrollTop: $('.dependentBox').offset().top}, 1000);
       }else if(recur_frequency=="weekly"){
           for (var i = 1; i < 5; i++) {
              $("#recur_interval").append("<option value='"+i+"'>"+i+"</option>");
           }
           $('#recur_interval_div .floatify__label').text('Repeat Week');
           $("#recur_day_div, #recur_interval_div").show();
           $("#CommunicationBulkAction .modal-content").animate({ scrollTop: $('.dependentBox').offset().top}, 1000);
       }else{
           for (var i = 1; i < 11; i++) {
               $("#recur_interval").append("<option value='"+i+"'>"+i+"</option>");
           }
           $('#recur_interval_div .floatify__label').text('Repetition Frequency');
           $("#recur_interval_div").show();
           $("#CommunicationBulkAction .modal-content").animate({ scrollTop: $('.dependentBox').offset().top}, 1000);
       }
       $('.chosen-select').trigger("chosen:updated");
   }

function browseWidget(){
   $(".btn-attachment").click(function() {
       $('.attachmentFile, .attachmentFileBackdrop').toggle();
       $('.btn-attachment').toggleClass('active');
   })
   $('.attachmentFileBackdrop, .closeAttachment').click(function(){
       $('.attachmentFileBackdrop, .attachmentFile').fadeOut();
       $('.btn-attachment').removeClass('active');
   });
}

function tourCommunication(){
   var tCommunication= new Tour({
       steps: [
             {
               element: ".btn-previewDiv",
               title: "Preview",
               content: "Show a preview of how the Email/SMS will look.",
               template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button></nav></div>",
               placement: "top",
             },
             {
               element: ".btn-scheduleDiv",
               title: "Schedule",
               content: "Schedule the communication to send on a later date and time.",
               template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
               placement: "top",
             },
             {
               element: ".btn-testMail",
               title: "Send Test Email/SMS",
               content: "Send a test Email/SMS before actually sending them.",
               template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
               placement: "top",
             },
             {
               element: ".btn-attachment",
               title: "Attachment",
               content: "Add files and other attachments to send along with emails.",
               template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
               placement: "top",
             },
             {
               element: ".recurringBtn .toggle__checkbox",
               title: "Recurring Communication",
               content: "Use this feature to setup a repetitive communication. Choose the start date, frequency, duration, and end date.",
               template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-xs btn-npf pull-right' data-role='next'>Next »</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></nav></div>",
               placement: "top",
             },
             {
               element: "#TemplateCreationSubmitBtn1",
               title: "Send",
               content: "This action will allow user to Send your Email/SMS.",
               template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a><button class='btn btn-npf btn-xs pull-right' data-role='end'>End tour</button><button class='btn btn-xs btn-secondary-2 pull-right margin-right-15' data-role='prev'>« Prev</button></div>",
               placement: "top",
             }
           ],
       name : 'userCommunication',
       storage: window.localStorage,
       backdrop: true,
       backdropContainer : '#bulk_communication_html',
   });
   // Initialize the tour
   tCommunication.init();
   // Start the tour
   tCommunication.start();
}

function hitUserPopupBatchBind() {

   $('.modalButton').on('click', function (e) {
       $('#confirmDownloadYes').off('click');
       $('#confirmDownloadTitle').text('Download Confirmation');
   $('#ConfirmDownloadPopupArea .npf-close').hide();
       $('.confirmDownloadModalContent').text('Do you want to download the templates ?');//download the leads
       var confirmation=$(this).text();
       var $form = $("#FilterCommunicationManageTemplateForm");
           $form.attr("action", jsVars.FULL_URL+'/communications/download-comm-template');
           $form.attr("target", 'modalIframe');
           var onsubmit_attr = $form.attr("onsubmit");
           $form.removeAttr("onsubmit");
           $('#confirmDownloadYes').on('click',function(){
               $('.draw-cross').css('display','block');
               $form.attr("target", 'modalIframe');
               $('#ConfirmDownloadPopupArea').modal('hide');
               var data = $form.serializeArray();
               $.ajax({
                   url: jsVars.FULL_URL+'/communications/download-comm-template',
                   type: 'post',
                   data : data,
                   dataType:'html',
                   headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                   success:function (response){
                       if(response != '') {
                           alertPopup(response,'error');
                       } else {
                           $('#muliUtilityPopup').modal('show');
                           $('#muliUtilityPopup .close').addClass('npf-close');
                       }
                   }
               });
               $form.attr("onsubmit", onsubmit_attr);
               //$form.attr("action", '/communications/manage-template');
               $form.removeAttr("target");
           });

   });

   $("#popupDismiss").on("click", function()
   {
       var $form = $("#FilterCommunicationManageTemplateForm");
       $form.attr("action", '/communications/manage-template');
       $form.attr("target", '');

   });
   $('#myModal').on('hidden.bs.modal', function () {
       $("#modalIframe").html("");
       $("#modalIframe").attr("src", "");
   });

   if(jsVars.downloadListModuleUrl !== 'undefined' && jsVars.downloadListModuleUrl !== '') {
       $('#downloadListing').prop('href',jsVars.downloadListModuleUrl);
       $('#showlink').show();
   } else {
       $('#showlink').hide();
   }
}

function showhideActionBtn(count){
   if(count == 0 ){
       $('.actionBtn').hide();
   }else{
       $('.actionBtn').removeAttr("disabled");
   }
}

$(document).on('click','span.template_sorting i', function (){
   jQuery("span.sorting_span i").removeClass('active');
   var field = jQuery(this).data('column');
   var data_sorting = jQuery(this).data('sorting');
   $('#sort_options').val(field+"|"+data_sorting);
   jQuery(this).addClass('active');
   LoadMoreCommunicationTemplates('reset');
});

if($("#templateFor").val() == 'sms')
{
   $("#dlt_approved").parent().show()
   $("#dlt_template_id").parent().show()
}else{
   $("#dlt_approved").parent().hide()
   $("#dlt_template_id").parent().hide()
   $("#dlt_approved").val('')
   $("#dlt_template_id").val('')
}
$("#templateFor").change(function() {
   if($(this).val() == 'sms')
   {
       $("#dlt_approved").parent().show()
       $("#dlt_template_id").parent().show()
   }else{
       $("#dlt_approved").parent().hide()
       $("#dlt_template_id").parent().hide()
       $("#dlt_approved").val('')
       $("#dlt_template_id").val('')
   }

});

function loadTemplate(){
   var $form = $("#FilterCommunicationManageTemplateForm");
       console.log("consoled" + $form);
   $form.attr("action", '/communications/manage-template');

   var collegeId = $("#filterReportScheduleCollege").val();
   if(collegeId === ''){
       alertPopup('Please select college','error');
   }else{
       $form.submit();
   }
}

function communicationTemplateApprove(templateId,status,type) {
   $('body div.loader-block').show();
   $("#ConfirmPopupArea").modal('hide');
   $.ajax({
       url: jsVars.communicationTemplateApprove,
       data: {templateId: templateId,status: status,type:type},
       dataType: "json",
       async: false,
       cache: false,
       type: "POST",
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       success: function (json) {
           $('body div.loader-block').hide();
           if (json['status'] == 1) {
               $('#SuccessPopupArea p#MsgBody').html(json['message'])
               $('#SuccessPopupArea .modal-header button.close').html('<span aria-hidden="true">×</span>');
               $('#SuccessPopupArea a#OkBtn').show();

               $("#SuccessPopupArea a#OkBtn").bind("click", function () {
                   $('#FilterCommunicationManageTemplateForm').submit();
               });
               $("#SuccessPopupArea").modal();
           } else {
               if(json['message']){
                   alertPopup(json['message'],'error');
               }else{
                   alert('We got some error, please try again later.');
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

   return false;
}

function initUnlayerEditor(params, templateJson) {
   if(typeof unlayer == 'undefined') {
       window.setTimeout(function(){
           initUnlayerEditor(params, templateJson)
       }, 500);
       return;
   }
   var initParams = {
       id: 'editor-container',
       projectId: jsVars.unlayerProjectId,
       displayMode: 'email',
       appearance: {
           theme: 'light',
           panels: {
               tools: {
                 dock: 'right'
               }
           }
       },
       features: {
           textEditor: {
               spellChecker: true
           },
           imageEditor: true,     //Paid
           stockImages: true,     //Paid
        }
   };
   if(typeof params != 'undefined' && params != '') {
       initParams.mergeTags = params;
   }
   unlayer.init(initParams);
   if((typeof templateJson != 'undefined') && (templateJson != '') && (typeof templateJson === 'object')) {
       unlayer.loadDesign(templateJson);
   } else if((typeof templateJson != 'undefined') && (templateJson != '')) {
       unlayer.loadDesign($.parseJSON(templateJson));
   }
   $('body').addClass('scroolStop');

    if(typeof unlayer != 'undefined') {
        unlayer.addEventListener('design:updated', function(data) {
            if($("#is_edit_template").length > 0) {
                $("#is_edit_template").val(1);
            }
        });
    }
}

function saveTemplate(type) {
   if($('#template-editor').val() == '' || $('#template-editor').val() == 0) {
       alertPopup('Template Editor is not selected, please go back and select template editor.', 'error');
       return false;
   }
   $('#'+type).prop('disabled', true);
   var params = { type : type, template_editor : $('#template-editor').val()};
   if($('#template-editor').val() == 1) {
       var ckdata = CKEDITOR.instances['editor'].getData();
       if(ckdata == '') {
           alertPopup('Template empty.', 'error');
           $('#'+type).prop('disabled', false);
           return false;
       } else {
           params.template_html = ckdata;
       }
       sendSaveTemplateRequest(params,type);
   } else {
       unlayer.exportHtml(function(data) {
           params.template_json = JSON.stringify(data.design); // design json
           params.template_html = data.html; // design html
           sendSaveTemplateRequest(params,type);
       });
   }
}

function sendSaveTemplateRequest(params, type) {
   $.ajax({
       url: jsVars.saveTemplateUrl,
       type: 'post',
       dataType: 'json',
       data: params,
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       beforeSend: function () {
           $('#modalLoaderDiv').show();
       },
       complete: function () {
           $('#modalLoaderDiv').hide();
       },
       success: function (data) {
           if(typeof data.error != 'undefined' && data.error != '') {
               if (data.error == 'session_logout' || data.error == 'invalid_csrf') {
                   window.location.reload(true);
               }else{
                   $('#'+type).prop('disabled', true);
                   alertPopup(data.error, 'error');
               }
           } else if(typeof data.redirect !='undefined' && data.redirect != '' && typeof data.success !='undefined' && data.success == true) {
               window.location.href = data.redirect;
           } else if(typeof data.redirect !='undefined' && data.redirect == '' && typeof data.success !='undefined' && data.success == true) {
               $('#'+type).prop('disabled', false);
               alertPopup('Successfully Saved', 'success');
           }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
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

function bulkWhatsappCommunication(ctype,national_sender='',international_sender=''){
   //var all_records = ($('#all_records_val').length>0?$('#all_records_val').val():0);
   var template_id = ($('#whatsAppTemplateList').length>0?$('#whatsAppTemplateList').val():0);
   $('div.loader-block').hide();
   $('#bulkloader').show();
   var total_count = $('#tot_records').text();
   var all_records = $('#all_records_val').val();//$('#all_records').text();
   var list_manager_id = '';

   if(ctype==='applications'){
       var data = $(' #FilterApplicationForms').serializeArray();
   }
   else if((ctype === 'leads_list') || (ctype === 'applications_list'))
   {
       var data = $('#listManager').serializeArray();
       list_manager_id = $('#list_manager_id').val();
       all_records = total_count = '';
   }
   else if(ctype === 'mktg_leads' || ctype === 'mktg_segments'){
       var data = $('#manageContacts').serializeArray();
       var select_all = $('#select_all:checked').val();
       if($('#single_user_id').val()!=='') {
          all_records = total_count = 1;
       }
       else if (typeof select_all === 'undefined'){
           all_records = total_count = '';
       }
   }
   else if(ctype==='userleads') {
       var data = $('#FilterLeadForm').serializeArray();
   }else{
       $('#listloader').hide();
       alertPopup('We are not able to process your request right now. Please refresh the page and try again. In case, you face the issue again, get in touch with your dedicated Account Manager.','error');
       return;
   }

   data.push({name: "total_count", value: total_count});
   data.push({name: "all_records", value: all_records});
   data.push({name: "ctype", value: ctype});
   data.push({name: "list_manager_id", value: list_manager_id});
   data.push({name: "national_sender", value: national_sender});
   data.push({name: "international_sender", value: international_sender});
    $.ajax({
       url: '/communications/bulk-whatsapp-communication',
       type: 'post',
       dataType: 'html',
       data: data,
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       success: function (data) {
           $('#bulk_communication_html').html(data);
           //$.material.init();
           $('div.loader-block').hide();
           browseWidget();
                       floatableLabel();
           if (document.documentElement.clientWidth > 992) {
               $('#bulk_communication_html [data-toggle="tooltip"]').tooltip({
                   placement: 'top',
                   trigger : 'hover',
                   template: '<div class="tooltip layerTop" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
               });
           }
           $('#bulkloader').hide();
           $('#listloader').hide();

           $("#schedule_button").hide();
           $("#commSubmitBtn").show();

           //$('#bulk_communication_action li:nth-child(2)').find('span').html('Bulk SMS');
           if(ctype!='' && (ctype=='mktg_leads_list' || ctype=='mktg_leads' || ctype=='mktg_segments_list' || ctype=='mktg_segments') ) {
               //If single id is selected then set text to Single Email/SMS
               if($('#to_mobile').length>0) {
                       var totalSMS=parseInt($('#to_mobile').val());
                       if(totalSMS==1) {
                           //$('#bulk_communication_action li:nth-child(2)').find('span').html('Single SMS');
                       }

               }
           }
           if(template_id > 0){
               $('#whatsAppTemplateList').val(template_id);
               $('select#whatsAppTemplateList').trigger("change");
           }
           //console.log(data);
           $('[data-toggle="tooltip"]').tooltip();
       },
       error: function (xhr, ajaxOptions, thrownError) {
           //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

/*
* Not in use
* /
/*
function sendWAMsgPopup(ctype,preview){
   if(typeof preview !=  'undefined' && preview == 'whatsapp') {
       $('#ConfirmMsgBody').html('Please Send out a message before sending out the Actual campaigns​.');
       $('#confirmYes').unbind('click');
       $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false}).off('click', '#confirmYes').on('click', '#confirmYes', function (e) {
           $('#ConfirmPopupArea').modal('hide');
           previewOrsendTestWhatsapp(ctype,preview);
       });
   }else{
       previewOrsendTestWhatsapp(ctype,preview);
   }
}
*/

/*
* This function will send test whatsapp from communication pop up
*/
function previewOrsendTestWhatsapp(ctype,preview){

   if(typeof preview === 'undefined') {
       preview='';
   }

   var error='';
   if(preview === 'whatsapp') {
       if($.trim($('#test_whatsapp_id').val())==='') {
           error+="Please enter mobile number.<br />";
       }
   }

   /*else if(ValidateEmailAddress($.trim($('#test_email_id').val())) === false) {
       error+="Please enter a valid test email id.<br />";
   }*/

   if(error!=='') {
       // alertPopup(error,'error');
       $('#test_wa_error').show().html(error);
       return false;
   }

   $('#disperror').hide();
   $('#dispsuccess').hide();

   $('div.loader-block').show();
   $('#text_whatsapp_id_btn').attr('disabled','disabled');
   var data='';
   switch(ctype){
       case 'leads_list':
       case 'applications_list':
           data = $('#bulkWhatsappCommunication, #listManager').serialize();
           break;
       case 'mktg_leads':
       case 'mktg_segments':
           data = $('#bulkWhatsappCommunication, #manageContacts').serialize();
           break;
       case 'mktg_leads_list':
           data = $('#bulkWhatsappCommunication, #listManager').serialize();
           break;
       case 'mktg_segments_list':
       case 'leads_segments':
           data = $('#bulkWhatsappCommunication, #segmentManager').serialize();
           break;
       case 'userleads':
           data = $('#bulkWhatsappCommunication, #FilterLeadForm').serialize();
           break;
       case 'applications':
           data = $('#bulkWhatsappCommunication, #FilterApplicationForms').serialize();
           break;
   }

   data = data + '&body_content=' + encodeURIComponent($.trim($('#WhatsAppTextArea').val()));

   data=data+'&preview='+preview;

    $.ajax({
       url: '/communications/send-test-email-and-sms',
       type: 'post',
       dataType: 'json',
       data: data,
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       success: function (json) {
           if(typeof json['session_logout'] !== 'undefined') {
               if(typeof json['redirect'] !== 'undefined'){
                   window.location.href = json['redirect'];
               }else{
                   window.location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
               }
           }
           if(preview==='') {
               $('#text_whatsapp_id_btn').removeAttr('disabled');
           }
           //$.material.init();
           $('div.loader-block').hide();
           $('#bulkloader').hide();
           if(typeof json['error'] !== 'undefined' && json['error']!=='') {
               $('#text_whatsapp_id_btn').removeAttr('disabled');
               // alertPopup(json['error'],'error');
               $('#test_wa_success').html('').hide();
               $('#test_wa_error').show().html(json['error']);
           } else if(typeof json['data'] !== 'undefined' && json['data']!=='') {
               if(preview === 'whatsapp_preview') {
                   $('#communicationPreviewModal > .modal-dialog').css("width","56%");
                   $('#communicationPreviewModal > div > div > div > h2.modal-title').html('Whatsapp Preview');
                   $('#showCommunicationPreviewContainer').html(json['data']);
                   $("#communicationPreviewModal").modal();
               } else if(preview === 'whatsapp') {
                   // alertPopup(json['data'],'success');
                   $('#test_wa_error').html('').hide();
                   $('#test_wa_success').show().html(json['data']);
               }
           }

       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function fullScreen(){
   // open in fullscreen
   $('.requestfullscreen').click(function() {
       $('#editor-container').fullscreen();
       return false;
   });

   // exit fullscreen
   $('.exitfullscreen').click(function() {
       $.fullscreen.exit();
       return false;
   });

   // document's event
   $(document).bind('fscreenchange', function(e, state, elem) {
       // if we currently in fullscreen mode
       if ($.fullscreen.isFullScreen()) {
           $('#editor-container').css('padding', '20px 10%');
           $('#editor-container > h4').css('color', '#fff');
           $('.requestfullscreen').hide();
           $('.exitfullscreen').show();
       } else {
           $('#editor-container').css('padding', '0px');
           $('#editor-container > h4').css('color', '#111');
           $('.requestfullscreen').show();
           $('.exitfullscreen').hide();
       }
   });
};

function uploadAttachmentCreateTemplate(templateFor='') {
   $('div.loader-block').show();
   $('#TemplateCreationForm').ajaxSubmit({
       beforeSubmit: function() {
           $("#progress-bar").show();
           $("#progress-bar").width('0%');
       },
       uploadProgress: function (event, position, total, percentComplete){

           $("#progress-bar").width(percentComplete + '%');
           $("#progress-bar").html('<div id="progress-status">' + percentComplete +' %</div>')
       },
       success:function (data){
           if(templateFor === 'whatsapp_business'){
               $('#UploadWhatsappFileInfoContainer').append(data);
               $('#WhatsappUpload').val('');
           }else{
               $('#UploadFileInfoContainer').append(data);
               $('#EmailUpload').val('');
           }
           $("#progress-bar").hide();
           $('div.loader-block').hide();
           $('#TemplateCreateSubmitBtn').prop('disabled',false);
       },
       resetForm: false
   });
   return false;
}

$(document).on('click', '#publishMarketingLP', function (event) {
   event.preventDefault();
   unlayer.exportHtml(function(data) {
//        params.template_json = JSON.stringify(data.design); // design json
       $('#TemplateHtml').val(data.html); // design html
       $('#TemplateChooseForm').ajaxSubmit({
           success:function (data){
               $('#UploadFileInfoContainer').append(data);
               $('#EmailUpload').val('');
               $("#progress-bar").hide();
               $('div.loader-block').hide();
               $('#TemplateCreateSubmitBtn').prop('disabled',false);
           },
           resetForm: false
       });
   });
});

function updateTemplatePreview(id) {
   $.ajax({
       url: jsVars.commTemplatePreviewUrl+id,
       type: 'GET',
       dataType: 'html',
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       beforeSend: function () {
           $('#modalLoaderDiv').show();
       },
       complete: function () {
           $('#modalLoaderDiv').hide();
       },
       success: function (data) {
           if(data == 'seesion_logout' || data == 'invalid_request') {
               window.location.reload();
           } else {
               $('#appUnlayerIframeDiv').html('<iframe class="app-iframe-preview" width="100%" height="450px" border="0" style="border:0;"></iframe>').show();
               document.querySelector('iframe').contentDocument.write(data);
               $('.unlayer-editor').hide();
               unlayerTemplateText = data;
           }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function getAllDocumentList(collegeId,formId,document=null,templateType=null){
   if(typeof collegeId === 'undefined' || collegeId === null || collegeId === ''){
       return false;
   }

   $.ajax({
       url: '/communications/ajax-all-document-list',
       data: {collegeId: collegeId, formId: formId, document: document},
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
               var listHtml = '<option value="">Select Document</option>';
               if(json['downloadList']) {
                   for(var listId in json['downloadList']) {
                       listHtml += '<option value="'+ listId +'">'+ json['downloadList'][listId] +'</option>';
                   }
               }
               if(templateType === 'email'){
                   $('#emailDocuments').html(listHtml);
                   $("#emailDocuments").val(document).trigger("chosen:updated");
               }else{
                   $('#whatsappDocuments').html(listHtml);
                   $("#whatsappDocuments").val(document).trigger("chosen:updated");
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

function stripslashes(str) {
   str = str.replace(/\\'/g, '\'');
   str = str.replace(/\\"/g, '"');
   str = str.replace(/\\0/g, '\0');
   str = str.replace(/\\\\/g, '\\');
   return str;
}


function validateWhatsappBusinessTemplate(){
   var templateType = $('#template-type').val();
   var error = false;

   if(templateType != 'whatsapp_business'){
       return error;
   }

   $('div.col-sm-8 .error').html('');
   if(typeof $('#TemplateTitleInput').val() == 'undefined' || $('#TemplateTitleInput').val() == '' ){
       $('#TemplateTitleInput').parents('div.col-sm-8').find('.error').html('Please enter template name.');
       error = true;
   }
   if(typeof $('#CollegeIdSelect').val() == 'undefined' || $('#CollegeIdSelect').val() == '' ){
       $('#CollegeIdSelect').parents('div.col-sm-8').find('.error').html('Please select a college.');
       error = true;
   }

   if(typeof $('#applicableSelect').val() == 'undefined' || $('#applicableSelect').val() == '' ){
       $('#applicableSelect').parents('div.col-sm-8').find('.error').html('Please select template applicable for');
       error = true;
   }

   if(typeof $('#WhatsAppBusinessTextArea').val() == 'undefined' || $('#WhatsAppBusinessTextArea').val() == '' ){
       $('#WhatsAppBusinessTextArea').parents('div.col-sm-8').find('.error').html('Please enter template text.');
       error = true;
   }

   /*
       NO1-T1785 : Separate field to enter WhatsApp template name
       Dhananjay : 02-Nov-2020
   */
   var regex_wtid = /^[a-z0-9_-]+$/;
   if(typeof $('#WhatsappTemplateID').val() == 'undefined' || $('#WhatsappTemplateID').val() == '' ){
       $('#WhatsappTemplateID').parents('div.col-sm-8').find('.error').html('Please Enter Whatsapp Template Title');
       error = true;
   }else if($('#WhatsappTemplateID').val() != ''){
       if(!regex_wtid.test($('#WhatsappTemplateID').val())){
           $('#WhatsappTemplateID').parents('div.col-sm-8').find('.error').html('WhatsApp Template Title should not contain blank space, uppercase or special character.');
           error = true;
       }
   }

   if(typeof $('#templateFormat').val() == 'undefined' || $('#templateFormat').val() == '' ){
       $('#templateFormat').parents('div.col-sm-8').find('.error').html('Please select Template format');
       error = true;
   }


   if(typeof $('#UserAccessListSelect').val() == 'undefined' || $('#UserAccessListSelect').val() == '' ){
       $('#UserAccessListSelect').parents('div.col-sm-8').find('.error').html('Please select user.');
       error = true;
   }
   if(typeof $('#category').val() == 'undefined' || $('#category').val() == '' ){
       $('#category').parents('div.col-sm-8').find('.error').html('Please select Template Category');
       error = true;
   }

   return error;
}

function displayWhatsappAttachmentDocumentList(){
   var templateType = $('#template-type').val();

   if(templateType != 'whatsapp_business' && templateType != 'email'){
       return;
   }

   $(".document-type").hide();
   $('#dynamicDoc').parents('.col-md-3').hide();
   $(".whatsapp-document").hide();
   $(".whatsapp-attached").hide();
   
   if($('#applicableSelect').length > 0 && typeof $('#applicableSelect').val() !== 'undefined'){
       var applicableSelect= $('#applicableSelect').val();
   }
   else if($('#applicable-for-read-only').length > 0 && typeof $('#applicable-for-read-only').val() !== 'undefined'){
       var applicableSelect= $('#applicable-for-read-only').attr('data-value').toLowerCase();
   }

   if(typeof $('#whatsappDocuments').val() !== 'undefined' && $('#whatsappDocuments').val() !== ''){
       var whatsappDocuments = $('#whatsappDocuments').val();
   }


   var templateFormat  = $('#templateFormat').val();
   var formId = $('#FormIdSelect').val();
   var whatsappDocuments = $('#whatsappDocuments').val();

   if(typeof templateFormat !== 'undefined' && templateFormat !== null){

       if(templateType === 'email'){
           $("#file-size-text").html('(Total file size should be 5 MB or less.)');
           $(".email-document-type").show();
           if($('#emailStaticDoc').is(':checked')){
               $('#emailStaticDoc').prop("checked", true).trigger("click");
               $('#emailDynamicDoc').prop('disabled',true);
           }           
           $('.disabled_radio').attr('data-original-title',"Select Applications in 'Template Applicable for' then choose Form Name to enable Dynamic Document Type");
           if(typeof applicableSelect !== 'undefined' && applicableSelect === 'applications' && formId !=='' && typeof formId !==  'undefined' && formId !== null){
               $('#emailDynamicDoc').prop('disabled',false);
               $('.disabled_radio').removeAttr('data-original-title');
               if(whatsappDocuments !== null && whatsappDocuments !==''){
                   $('#emailDynamicDoc').prop("checked", true).trigger("click");
               }
               else{
                   if($('#emailStaticDoc').is(':checked')){
                       $('#emailStaticDoc').prop("checked", true).trigger("click");
                   }
                   else{
                       $('#emailDynamicDoc').prop("checked", true).trigger("click");
                   }
                   
               }
           }
       }
       else if(typeof templateFormat !== 'undefined' && templateFormat !== null){

           if(templateFormat === ''){
               $(".document-type").hide();
               $(".whatsapp-document").hide();
               $(".whatsapp-attached").hide();
           }
           else if(templateFormat == 'text' || templateFormat == 'template'){
               $("#whatsapp-content-label").html("Content <span class='requiredStar'>*</span>");
           }
           else{
               $("#file-size-text").html('(Total file size should be 5 MB or less.)');
               $(".document-type").show();
               $('#staticDoc').prop("checked", true).trigger("click");
               $('#dynamicDoc').parents('.col-md-3').hide();
               $("#whatsapp-content-label").html("Caption");
               if(templateFormat == 'document' && typeof applicableSelect != 'undefined' && applicableSelect == 'applications' && formId !=='' && typeof formId !=  'undefined' && formId != null){
                   $('#dynamicDoc').parents('.col-md-3').show();
                   if(whatsappDocuments !== null && whatsappDocuments !==''){
                       $('#dynamicDoc').prop("checked", true).trigger("click");
                   }
                   else{
                       $('#staticDoc').prop("checked", true).trigger("click");
                   }
               }

               if(templateFormat == 'image'){
                   $("#file-size-text").html('(Total file size should be 1 MB or less.)');
               }
           }
       }
   }
}

$("#searchCommunicationTemplate").keydown(function (e) {
   if (e.keyCode == 13) {
       e.preventDefault();
       loadTemplate();
   }
});

function updateTemplateFilter(selectedStatus)
{
   $("#Status").val(selectedStatus);
   loadTemplate();
}

function markAsFavourite(elem, selectedStatus)
{
   var collegeId = $("#filterReportScheduleCollege").val();
   if(collegeId === ''){
       alertPopup('Please select college','error');
       return false;
   }
   let unMarkFavourite = false;
   let viewType = $(elem).attr("data-view");
   let favouriteViewStatus = $(elem).attr("data-favourite");
   if(favouriteViewStatus === 1)
   {
       $(elem).removeClass("favouriteTemplate");
       unMarkFavourite = true;
       $("#Status").val("");
   }else{
       $("ul.templateViews li i").each(function()
       {
//            $(this).removeClass("favouriteTemplate");
           $(this).removeClass("fa-star").addClass("fa-star-o").removeClass("favouriteTemplate");
           $(this).attr("data-favourite", "0");
       });
       $(elem).attr("data-favourite", "1");
       $(elem).removeClass("fa-star-o").addClass("fa-star").addClass("favouriteTemplate");
       $("#Status").val(selectedStatus);
   }

   $.ajax({
       url: jsVars.markViewFavouriteUrl,
       type: 'post',
       data: {'selectedStatus' : selectedStatus, collegeId : collegeId, unMarkFavourite : unMarkFavourite},
       dataType: 'json',
       headers: {
           "X-CSRF-Token": jsVars._csrfToken
       },
       beforeSend: function() {
           showLoader();
       },
       complete: function() {
           hideLoader();
       },
       success: function (response) {
           let message = "";
           if(favouriteViewStatus == 1)
           {
               message = " template view has been removed from your default view. Default selection will be View All.";
           }else{
               message = " template view has been marked as your default view";

           }
           $("#SuccessPopupArea button.close").hide();
           alertPopup(viewType + message, "success");
           setTimeout(function(){loadTemplate();},1000);
       },
       error: function (xhr, ajaxOptions, thrownError) {
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

$(document).on('change', '#to_mobile', function () {
   var sendTo = this.value;
   var collegeId = $("#college_id").val();
   var formId = $("#form_id").val();
   var userId = $("#user_id").val();
   var ctype = $("#ctype").val();

   if(ctype !== 'userleads'){
       return false;
   }
   if(userId == undefined || userId == ''){
       return false;
   }

   $.ajax({
       url: '/communications/check-receiver-dial-code',
       data: {college_id: collegeId, form_id: formId, user_id: userId, to_mobile: sendTo},
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
               if(json['data']['sender_type'] !== 'national'){
                   $(".nationalSender").hide();
                   $(".internationalSender").show();
               }else{
                   $(".nationalSender").show();
                   $(".internationalSender").hide();
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
});

if(jsVars.selectedStatusValue != 'undefined' && jsVars.selectedStatusValue != "0")
{
   $("#Status").val(jsVars.selectedStatusValue);
}
function pipeValidation(val='',field_id){
   var inputVal = val;
   $('#errorClear').remove();
   $('#removeWithPipe').text('');
   $("#voive-progress-bar").hide();
   $('div.loader-block').hide();
   $('#TemplateCreateSubmitBtn').prop('disabled',false);
   var sign = '||';
   var count = 0;
   for (var i=0;i< inputVal.length;i++) {
       if (sign === inputVal.substr(i,sign.length))
       count++;
   }
   if(count > 0){
       $('#'+field_id).after('<span class="error" id="errorClear">Name cannot have more than single pipe. Please enter name correctly.</span>');
       return false;
   }
   return true;
}

if (('#communicationTemplateHistory').length > 0) {
   $(document).on('click', '#communicationTemplateHistory', function (e) {
       e.preventDefault();
       var templateId = $(this).attr("rel");
       if (templateId > 0)
       {
           $.ajax({
               url: jsVars.communicationTemplateRevisionList,
               data: {template_id: templateId},
               dataType: "html",
               async: false,
               type: "POST",
               headers: {
                   "X-CSRF-Token": jsVars._csrfToken
               },
               beforeSend: function () {
                   $('#listloader').show();
                   $("#ConfirmPopupArea").modal('hide');
                   $('.dropdown-menu-tc').hide();
               },
               complete: function () {
                   $('#listloader').hide();
               },
               success: function (html) {
                   if(typeof html !== 'undefined' && html === 'session') {
                       location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                   }
                   else if(typeof html !== 'undefined' && html === 'invalid_request'){
                       alertPopup('We got some error, please try again later.','error');
                   }
                   else if(typeof html !== 'undefined' && html === 'data_not_found'){
                       alertPopup('No Hisory found.','error');
                   }
                   else{
                       $('#StatusDetailPopupArea').addClass('right offCanvasModal in');
                       $('#StatusDetailPopupArea .modal-dialog').addClass('modal-lg').css('left','auto');
                       $('#StatusDetailPopupArea .modal-header').addClass('offCanvasModalheader');
                       $('#StatusDetailPopupArea .modal-header .close').html('<span class="glyphicon glyphicon-remove"></span>');
                       $('#StatusDetailPopupArea .modal-body').removeClass('text-center');
                       $('#StatusDetailPopupArea h2#alertTitle').html('View Version History');
                       $('#StatusDetailPopupArea #StatusDetailPopupHTMLSection').html(html);
                       $("#StatusDetailPopupArea").modal();
                   }
               },
               error: function (response) {
                   alertPopup(response.responseText);
               },
               failure: function (response) {
                   alertPopup(response.responseText);
               }
           });
       } else
       {
           alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
       }
   });
}

$('.select_template').click(function(){
   selectAllTeamplate(this,'singleRow');
})
function selectAllTeamplate(elem,singleRow=''){

   // facebook-custom-audiences
   $('div.loader-block').show();
   $("#selectionRow").hide();
   $("#clearSelectionLink").hide();

   if(elem.checked){
       //console.log(elem.checked);
       $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecords('+ $("#all_records_val").val() +');"> Select all <b>'+ $("#all_records_val").val() +'</b>&nbsp;templates</a>');
       if(singleRow=='singleRow'){
           this.checked = true;
       }
       else{
           $('.select_template').each(function(){
               this.checked = true;
           });
       }

       var recordOnDisplay = $('.tbodyBorder input:checkbox:checked').length;//$('input:checkbox[name="selected_template[]"]').length;
       $("#currentSelectionMessage").html("All "+recordOnDisplay+" template(s) on this page are selected. ");
       $("#selectionRow").show();
       $("#selectAllAvailableRecordsLink").show();
       $("#clearSelectionLink").hide();
       //$('#li_bulkCommunicationAction,#li_facebookCustomAudiences').show();
   }
   else{
       if(singleRow=='singleRow'){
           $("#selectAllAvailableRecordsLinkSpan").html('<a id="selectAllAvailableRecordsLink" href="javascript:void(0);" onclick="selectAllAvailableRecords('+ $("#all_records_val").val() +');"> Select all <b>'+ $("#all_records_val").val() +'</b>&nbsp;templates</a>');
           var recordOnDisplay = $('.tbodyBorder input:checkbox:checked').length;//$('input:checkbox[name="selected_template[]"]').length;
           $("#currentSelectionMessage").html("All "+recordOnDisplay+" template(s) on this page are selected. ");
           $("#selectionRow").show();
           $("#selectAllAvailableRecordsLink").show();
           $("#clearSelectionLink").hide();
           if(recordOnDisplay <= 0){
               $('div.loader-block').hide();
               $("#selectionRow").hide();
               $("#selectAllAvailableRecordsLink").hide();
           }
       }
       else{
           $('.select_template').attr('checked',false);
           $("#selectAllAvailableRecordsLink").hide();
       }

   }
   var checkedfalse = true;
   $('.select_template').each(function(){
       if(this.checked === false){
           $('#select_all').attr('checked',false);
           checkedfalse = false;
       }
   });

   if(checkedfalse==true && singleRow=='singleRow' && $('#select_all').is(':checked')==false){
       $('#select_all').trigger('click');
   }
   $('div.loader-block').hide();
}
function clearSelectionTemplate(){
   $("#selectionRow").hide();
   $("#selectAllAvailableRecordsLink").hide();
   $("#clearSelectionLink").hide();
   $('.select_template').each(function(){
       this.checked = false;
   });
   $('#select_all').attr('checked',false);
   $('#checkedAll').val('');
}

function selectAllAvailableRecords(totalAvailableRecords){
   $("#selectionRow").show();
   $("#selectAllAvailableRecordsLink").hide();
   $("#clearSelectionLink").show();
   $("#currentSelectionMessage").html("All "+totalAvailableRecords+" leads are selected.");

   if($('#select_all').is(':checked')==true){
       $('.select_template').each(function(){
           this.checked = true;
       });
       $('#select_all').attr('checked',true);
   }
   else{
       $('#select_all').trigger('click');
       $("#selectionRow").show();
       $("#selectAllAvailableRecordsLink").hide();
       $("#clearSelectionLink").show();
       $("#currentSelectionMessage").html("All "+totalAvailableRecords+" leads are selected.");

   }

   $('#checkedAll').val('1');
}

function assignUserTemplate(){
   var $form = $("#FilterCommunicationManageTemplateForm");

   $form.attr("action", '/communications/assignUserTemplate');

   var collegeId = $("#filterReportScheduleCollege").val();
   if(collegeId === ''){
       alertPopup('Please select college','error');
   }else{
       $('#assignSubmitBtn').attr("disabled",true);
       $.ajax({
           url: jsVars.FULL_URL +'/communications/assignUserTemplate',
           data: $form.serialize(),
           dataType: "json",
           type: "POST",
           headers: {
               "X-CSRF-Token": jsVars._csrfToken
           },
           beforeSend: function() {
               $('#assignSubmitBtn').attr("disabled",true);
               showLoader();
           },
           complete: function() {
               hideLoader();
               $('#assignSubmitBtn').attr("disabled",false);
           },
           success: function (response) {
               if(response.status==0 && response.redirect){
                   location = response.redirect;
               }

               if(response.status==0 && typeof response.error!="undefined"){
                   alertPopup(response.error, 'error');
               }
               if(response.status==200 && response.message!=''){
                   $("#FilterCommunicationManageTemplateForm").trigger("reset");
                   $('#UserAccessListSelect').trigger('chosen:updated');
                   $("#UserAccessListSelect")[0].sumo.reload();
                   $('.close').trigger("click");
                   clearSelectionTemplate();
                   alertPopup(response.message, 'success','reload');
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
}

function forGetAssociatUser(CollegeId){
   if(CollegeId==''){
       alertPopup('Please select College', 'error');
       return false;
   }
   var num = $("input[name^='selected_template']:checked").length;
   if(num <= 0){
       $('.close').trigger("click");
       alertPopup('Please select template', 'error');
       return false;
   }
   GetCollegeAssociatedUserList(CollegeId,false);
   $('#assignTemplate').modal('show');

}
function assignReset(){
   $("#UserAccessListSelect").val('');
   //$("#FilterCommunicationManageTemplateForm").trigger("reset");
   $('#UserAccessListSelect').trigger('chosen:updated');
   $("#UserAccessListSelect")[0].sumo.reload();
   return false;
}

function getDailyCreditLimit(college_id,national_sender='',international_sender=''){
     $.ajax({
       url: jsVars.FULL_URL +'/communications/get-daily-credit-limit',
       type: 'post',
       dataType: 'json',
       data: {'college_id':college_id,'national_sender':national_sender,'international_sender':international_sender},
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       beforeSend: function () {
           $('.modalLoader').show();
       },
       complete: function () {
           $('.modalLoader').hide();
       },
       success: function (data) {
           if (data['redirect']){
               location = data['redirect'];
           }
           else if(data.status==200){
               $('#credit_info_msg #dailyCreditLimit').text(data.dailyLimit);
               $('#credit_info_msg_single #dailyCreditLimit').text(data.dailyLimit);
               $('#dailyCreditLimit_app').text(data.dailyLimit);
                if(data.dailyLimit <= 0){
                    $('#TemplateCreationSubmitBtn').attr('disabled',true);
                    $('#commSubmitBtn').attr('disabled',true);
                    $('#schedule_button').attr('disabled',true);
                    $('#crditmessage').html('<div class="alert alert-danger m0 radius-none"> <span class="draw-warning"></span>&nbsp;'+data.message_text+'</div>');
                }
                else {
                    $('#TemplateCreationSubmitBtn').attr('disabled',false);
                    $('#commSubmitBtn').attr('disabled',false);
                    $('#schedule_button').attr('disabled',false);
                    $('#crditmessage .alert').remove();
                }
           }
           else{
               $('#TemplateCreationSubmitBtn').attr('disabled',true);
               $('#commSubmitBtn').attr('disabled',true);
               $('#schedule_button').attr('disabled',true);
               $('#crditmessage').html('<div class="alert alert-danger m0 radius-none"> <span class="draw-warning"></span>&nbsp;'+data.message_text+'</div>');
           }
       },
       error: function (xhr, ajaxOptions, thrownError) {
           //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
           console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
       }
   });
}

function dropdownStopPropagation(){
    if ( $('.dropdown-stop-propagation').length){
        $(document).on('click', '.dropdown-stop-propagation .dropdown-menu', function (e) {
            e.stopPropagation();
          });
    }
}

dropdownStopPropagation();


//templatepreview dropdown
if ( $('.template-preview-dropdown').length){
    $('.template-preview-dropdown').on('hidden.bs.dropdown', function () {
        $('.template-preview-dropdown input').val('');
    });
}

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "windows_phone";
    }

    if (/android/i.test(userAgent)) {
        return "android";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "ios";
    }

    return "unknown";
}

//Machine Key Render In Text Area (WhatsApp Business)

$("#add_variable").on('click',function (e) {
    e.preventDefault();
    var $WhatsAppBusinessTextArea = $("#WhatsAppBusinessTextArea");
    $WhatsAppBusinessTextArea.replaceSelectedText("{{var}}", "collapseToEnd");
    $WhatsAppBusinessTextArea.focus();
    // For IE, which always shifts the focus onto the button
    window.setTimeout(function() {
        $WhatsAppBusinessTextArea.focus();
    }, 0);
});
$('#variable_configuration').on('click',function(e){
    e.preventDefault();
    var error = false;
    $('.template_for').parents('div.col-sm-8').find('.error').html('');
    $('#WhatsAppBusinessTextArea').parents('div.col-sm-8').find('.error').html('');
    if(typeof $('.template_for').val() == 'undefined' || $('.template_for').val() == '' ){
       $('.template_for').parents('div.col-sm-8').find('.error').html('Please select template applicable for');
       error = true;
    }
    if(typeof $('#WhatsAppBusinessTextArea').val() == 'undefined' || $('#WhatsAppBusinessTextArea').val() == '' ){
       $('#WhatsAppBusinessTextArea').parents('div.col-sm-8').find('.error').html('Please enter template text.');
       error = true;
    }
    if(error){
        window.scrollTo(600, 200);
        return false;
    }
    var template_id = 0;
    if(typeof $('#template_id').val() != 'undefined' && $('#template_id').val() != '' ){
        template_id = $('#template_id').val();
    }
    var content = $("#WhatsAppBusinessTextArea").val();
    if(typeof $('.template_for').attr('data-value') != "undefined"){
        var applicableSelect = $('.template_for').attr('data-value');
    }
    else{
        var applicableSelect = $('.template_for').val();
    }
    
    var formId = 0;
    var template_type = $('#template-type').val();
    var template_key = $('#template-key').val();
    if(typeof $('#FormIdSelect').val() != 'undefined' && $('#FormIdSelect').val() != '' ){
        formId = $('#FormIdSelect').val();
    }
    $.ajax({
       cache: false,
       url: jsVars.FULL_URL +'/communications/whatsapp-var-token-list',
       type: 'post',
       dataType: 'html',
       data: {'content':content,'template_applicable_for':applicableSelect,'formId':formId,
           'template_type':template_type,'template_key':template_key,'template_id':template_id},
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
//       beforeSend: function () {
//           $('.modalLoader').show();
//       },
//       complete: function () {
//           $('.modalLoader').hide();
//       },
       success: function (response) {
           data = $.parseJSON(response);
           if (data['redirect'] && data['status'] === 0){
               location = data['redirect'];
           }
           else if(data['error'] && data['status'] === 0){
               $('.close').trigger('click');
               alertPopup(data['error'],'error');
               return false;
           }
           else{
               $('.load_content').html(data['html']);
               onChangeApplicableToken(applicableSelect,'whatsapp_business','add_variable');
               $('.chosen-select').chosen();
           } 
       }
    });
});
function resetVariblae(){
    $(".field_val").val('');
    $(".field_val").trigger("chosen:updated");
}

function variableTokenMap(){
    $('.token_error').html("&nbsp;");
    $('#common_error').text('');
    var data = $('#varConfigForm').serializeArray();
    $.ajax({
       url: jsVars.FULL_URL +'/communications/variable-token-map',
       type: 'post',
       dataType: 'json',
       data: data,
       headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
       beforeSend: function () {
           $('.modalLoader').show();
       },
       complete: function () {
           $('.modalLoader').hide();
       },
       success: function (data) {
           if(data['redirect'] && data['status'] == 0){
               location = data['redirect'];
           }
           else if(data['error']!='' && data['status'] == 0){
               if(typeof data['empty_var']!="undefined" && data['empty_var']!=''){
                   $.each(data['empty_var'], function( index, empty_var){
                        $('#'+empty_var).text("Please select the desired token.");
                   });
               }
               else{
                   $('#common_error').text(data['error']);
               }
               return false;               
           }else {
               $('#WhatsAppBusinessTextArea').val(data['content']);
               $('.close').trigger('click');
               //alertPopup("You have successfully mapped token variable. Please click on save button.",'success');
           }
       }
    });
}

$('#Sample_Data').on('click',function(e){
    e.preventDefault();
    var error = false;
    $('#UploadWhatsappFileList').html('');
    $('#dynamicValue').val('');
    $('#templateFormat').parents('div.col-sm-8').find('.error').html('');
    $('#WhatsAppBusinessTextArea').parents('div.col-sm-8').find('.error').html('');
    $('#WhatsappTemplateID').parents('div.col-sm-8').find('.error').html('');
    if(typeof $('#WhatsAppBusinessTextArea').val() == 'undefined' || $('#WhatsAppBusinessTextArea').val() == '' ){
       $('#WhatsAppBusinessTextArea').parents('div.col-sm-8').find('.error').html('Please enter template text.');
       error = true;
    }
    if(typeof $('#templateFormat').val() == 'undefined' || $('#templateFormat').val() == '' ){
       $('#templateFormat').parents('div.col-sm-8').find('.error').html('Please select Template format');
       error = true;
    }
    if(typeof $('#WhatsappTemplateID').val() == 'undefined' || $('#WhatsappTemplateID').val() == '' ){
       $('#WhatsappTemplateID').parents('div.col-sm-8').find('.error').html('Please Enter Whatsapp Template Title');
       error = true;
    }
    var template_id = 0;
    if(typeof $('#template_id').val() != 'undefined' && $('#template_id').val() != '' ){
        template_id = $('#template_id').val();
    }
    var content = $("#WhatsAppBusinessTextArea").val();
    if(error){
        window.scrollTo(600, 200);
        return false;
    }
    var template_title = $('#TemplateTitleInput').val();
    var template_format  = $('#templateFormat').val();
    var college_id = $('#CollegeIdSelect').val();
    var whatsapp_template_id = $('#WhatsappTemplateID').val();
    var file_text = '';
    if(typeof $('.get_text').text()!="undefined"){
        file_text = $('.get_text').text();
    }
    $.ajax({
        cache: false,
        url: jsVars.FULL_URL +'/communications/whatsappKaleyraSampleData',
        type: 'post',
        dataType: 'html',
        data: {'content':content,'template_id':template_id,'template_format':template_format,'template_title':template_title,'college_id':college_id,'whatsapp_template_id':whatsapp_template_id,'file_text':file_text},
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        beforeSend: function () {
           $('#listloader').show();
       },
       complete: function () {
            $('#listloader').hide();
       },
        success: function (response) {
            data = $.parseJSON(response);
            if (data['redirect'] && data['status'] === 0){
                location = data['redirect'];
            }
            else if(data['error'] && data['status'] === 0){
                $('.close').trigger('click');
                alertPopup(data['error'],'error');
                return false;
            }
            else{
                $('.load_sample_data').html(data['html']);                
                $('#UploadWhatsappFileInfoContainer li').each(function(i){
                    if($(this).attr('id')!=''){
                        var splitid = ($(this).attr('id')).split('_');
                        var id = splitid[1];
                        var attach_val = $('#attach_'+id).val();
                        var file_name = ($(this).attr('data-val'));
                        var file_path = ($(this).attr('data-path'));
                        //var lidata = '<li id="li_' + id + '">' + file_name + '<input type="hidden" name="attachment_sampleData['+id+']" id="attachment_sampleData" value="' +attach_val+ '"/><input type="hidden" name="attachment_path[' +id+ ']" value="'+file_path+'"></li><span class="whatsapp-delete" style="cursor: pointer;" onClick="DeleteEmailAttachmentFile(\'' +id+ '\',\'UploadWhatsappFile\')"><i class="fa fa-times" aria-hidden="true"></i></span>';
                    //$('#UploadWhatsappFileList').append(lidata);
                    //$('#UploadWhatsappFile').append(lidata);
                    //$('#WhatsappFile').val('');
                    }
                });
            } 
            $('[data-toggle="popover"]').popover();
        }
    });
});
function addVariableValue(){
    var formData = $('#SampleDataForm').serializeArray();
    var error = false;
    let dynamicValue = [];
    //$('#file_error').html('&nbsp;');
    $('.token_error').html('&nbsp;');
    var error = false;
    $.each(formData, function( key, objval ) {
        var key_val = parseInt(key)+1;
        if(typeof $('#var_name_'+ key_val).val() != "undefined"){
            if($('#var_name_'+ key_val).val() == ''){
                $('#var'+key_val).text("Enter the desired sample data.");
                error = true;
                //return false;
            }
            else{
                var value = '{{$'+ key_val +'}}: '+$('#var_name_'+ key_val).val();
                dynamicValue.push(value);
            }           
        }                
    });
    if(typeof $('#templateFormat').val() !="undefined" && $('#templateFormat').val() != "template"){ 
        if(typeof $('#attachment_sampleData').val() == "undefined" || $('#attachment_sampleData').val()==''){
            $('#file_error').text('Please select sample data file.');
            error = true;
        }
    }
    if(error){
        return false;
    }
    $('#dynamicValue').val(dynamicValue);
    if(!error){
        $('.close').trigger('click');
    }
}
function uploadAttachmentSampleData(templateFor='') {
   //$('div.loader-block').show();
   $('#SampleDataForm').ajaxSubmit({
       url: jsVars.FULL_URL +'/communications/create-template/whatsapp_business', 
       beforeSubmit: function() {
           $("#progress-bar").show();
           $("#progress-bar").width('0%');
       },
       uploadProgress: function (event, position, total, percentComplete){
           $("#progress-bar").width(percentComplete + '%');
           $("#progress-bar").html('<div id="progress-status">' + percentComplete +' %</div>');
       },
       success:function (data){
           //console.log(data);
           if(templateFor === 'whatsapp_business'){
               $('#UploadWhatsappFileList').append(data);
               $('#UploadWhatsappFile').append(data);
               $('#WhatsappFile').val('');
           }
           $("#progress-bar").hide();
           //$('div.loader-block').hide();
           //$('#TemplateCreateSubmitBtn').prop('disabled',false);
       },
       resetForm: false
   });
   return false;
}
function resetForm(){
    $("#SampleDataForm")[0].reset();
    $('#UploadWhatsappFileList').html('');
    $('#UploadWhatsappFile').html('');
    $('#dynamicValue').val('');
}
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
   
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        $('#TemplateIdInput').parent().parent().parent().addClass('has-error');
        $('#template_dlt').text('Please enter only numeric value');
        return false;
    }
    else{
        $('#TemplateIdInput').parent().parent().parent().removeClass('has-error');
        $('#template_dlt').text('');        
    }
    return true;
}
function popTokenList(commonFields){
    if($(".pop-token-list").length > 0) {
        $(".pop-token-list").html(commonFields);
        $(".pop-token-list").each(function(index,val) {
            var current_id = $(this).attr('id');
            var current_data_val = ($(this).attr('data-val'));
            $('#'+current_id).val(current_data_val);
        });
        $(".pop-token-list").trigger("chosen:updated");     
    }
}

function DeleteEmailAttachmentFileForVersion(FileId,LiContainer) {
    ////////only for html delete//
   if (FileId) {
       $('#'+LiContainer+' #li_'+FileId).remove();
       $('#'+LiContainer+'List #li_'+FileId).remove();
       $('#UploadFileInfoContainer'+' #li_'+FileId).remove();
       $('#UploadWhatsappFileInfoContainer'+' #li_'+FileId).remove();
       if($(".whatsapp-delete").length > 0) {
           $('.whatsapp-delete').remove();
       }
       $('.icon_'+FileId).remove();
   }
}
