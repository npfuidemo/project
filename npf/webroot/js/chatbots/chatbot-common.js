function sumoDropdown(){$(".form_register_mapping_div").each(function(){this.selected=!1,id=$(this).attr("id"),$("#"+id+" .registration_field_value").SumoSelect({placeholder:"Select Field",search:!0,searchText:"Select Field",captionFormatAllSelected:"All Selected.",triggerChangeCombined:!0}),$("#"+id+" .registration_field_value")[0].sumo.reload()})}function LoadChatbotData(e){$(':input[type="button"]').attr("disabled",!0);var t=[];"reset"===e&&(varPage=0,$("#load_more_widget_container").html(""),$("#load_more_button").show(),$("#load_more_button").html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...')),""!=$("#college_id").val()?$("h3.manage-leads-txt").html("Manage Chatbots <small>("+$("#college_id option:selected").text()+")</small>"):$("h3.manage-leads-txt").html("Manage Chatbots"),(t=$("#FilterChatbotList,#FilterChatbotList1").serializeArray()).push({name:"page",value:varPage}),t.push({name:"type",value:e}),$("#load_more_button").attr("disabled","disabled"),$("#load_more_button").html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;&nbsp;Loading...'),$(".college_id_error").addClass("hide"),$("#creatChatBot").removeClass("thField").html(""),$.ajax({url:jsVars.FULL_URL+"/chatbots/ajax-manage-chatbots",type:"post",dataType:"html",data:t,headers:{"X-CSRF-TOKEN":jsVars._csrfToken},beforeSend:function(){$(".loader-block").show()},complete:function(){$(".loader-block").hide(),$("#creatChatBot").addClass("thField").html(createBot),$(".create_chatbot_btn").html(""),$(':input[type="button"]').removeAttr("disabled")},async:!0,success:function(t){varPage+=1;var o=t.substring(0,6);if("session_logout"===t)location=jsVars.FULL_URL+jsVars.LOGOUT_PATH;else if("CLGERR"===o&&"reset"===e)$(".college_id_error").removeClass("hide"),$("#load_more_button").hide();else if("ERROR:"===o)alert(t.substring(6,t.length)),$("#load_more_button").hide();else{var a=countResult(t=t.replace("<head/>",""));"reset"===e?$("#load_more_widget_container").html(t):$("#load_more_widget_container").find("tbody").append(t),a<10?$("#load_more_button").hide():$("#load_more_button").show(),$("#load_more_button").removeAttr("disabled"),$("#load_more_button").html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Chatbots'),table_fix_rowcol(),dropdownMenuPlacement(),determineDropDirection(),$(".offCanvasModal").modal("hide")}},error:function(e,t,o){console.log(o+"\r\n"+e.statusText+"\r\n"+e.responseText)}})}function countResult(e){return(e.match(/listDataRow/g)||[]).length}function GetChatbotUsers(e){e?$.ajax({url:jsVars.GetChatbotUsersLink,type:"post",data:{CollegeId:e},dataType:"json",headers:{"X-CSRF-Token":jsVars._csrfToken},success:function(e){if(e.redirect)location=e.redirect;else if(e.error)alertPopup(e.error,"error");else if(200==e.status){var t="<option value=''>Updated by</option>";t+=e.updateList,$("#updated_by").html(t);t="<option value=''>Created by</option>";t+=e.userList,$("#created_by").html(t),$("#created_by").trigger("chosen:updated"),$("#updated_by").trigger("chosen:updated")}},error:function(e,t,o){console.log(o+"\r\n"+e.statusText+"\r\n"+e.responseText)}}):($("#created_by").html('<option value="">Created by</option>'),$("#updated_by").trigger('<option value="">Published by</option>'),$("#created_by").trigger("chosen:updated"),$("#updated_by").trigger("chosen:updated"))}function LoadCollegeForms(e,t){var o="college_id="+e+"&default_val="+t;$.ajax({url:"/chatbots/get-college-chatbts",type:"post",dataType:"html",data:o,headers:{"X-CSRF-TOKEN":jsVars._csrfToken},async:!1,success:function(e){"session_logout"===e&&window.location.reload(!0),$("#div_load_forms").html(e),$(".chosen-select").chosen(),$(".chosen-select-deselect").chosen({allow_single_deselect:!0}),$(".chosen-select").trigger("chosen:updated")},error:function(e,t,o){console.log(o+"\r\n"+e.statusText+"\r\n"+e.responseText)}})}function fileSelectShow(){$(":file").on("fileselect",function(e,t,o){var a=$(this).parents(".input-group").find(":text"),n=t>1?t+" files selected":o;a.length?a.val(n):n&&alert(n)})}function selectAll(e){e.checked?$(".select_field").not(".disable-check").each(function(){this.checked=!0}):$(".select_field").not(".disable-check").attr("checked",!1)}function getChildList(e,t,o,a,n,r){t&&null!=t&&$.ajax({url:jsVars.FULL_URL+"/chatbots/get-child-list",type:"post",dataType:"html",data:{machine_key:t,widgetId:o,fieldKey:a,collegeId:n,parentKey:r},headers:{"X-CSRF-Token":jsVars._csrfToken},beforeSend:function(){$("div.loader-block").show()},complete:function(){$("div.loader-block").hide()},success:function(t){if("session_logout"===t)return window.location.reload(!0),!1;$("#childListContainer_"+e).html(t),$("#childListContainer_"+e).show(),$("#hide_btn_"+e).show(),$("#btn_"+e).hide(),$("#childListContainer_"+e).siblings().not(".listDataRow").hide(),$("#hide_btn_"+e).parents().parents().siblings().find(".hideOpt").hide(),$("#btn_"+e).parents().parents().siblings().find(".showOpt").show(),$(".sumo_select").SumoSelect({placeholder:"Select Value",search:!0,searchText:"Search reportees",selectAll:!0,captionFormatAllSelected:"All Selected.",triggerChangeCombined:!1}),$("select#level_value_"+a)[0].sumo.reload(),$("select.sumo_select").on("sumo:opened",function(e){$(".optionGroup").parent().parent().siblings().addClass("optionGroupChild"),$(".optionGroup").parent().parent().removeClass("optionGroupChild"),$("i.optionLastChild").each(function(){$(this).parent().parent().addClass("optionGroupChild2")})})},error:function(e,t,o){console.log(o+"\r\n"+e.statusText+"\r\n"+e.responseText)}})}function hideOptions(e){$("#childListContainer_"+e).hide(),$("#hide_btn_"+e).hide(),$("#btn_"+e).show()}function loadPreview(e){if($("#dynamic_load").parent("div").removeClass("desktop"),$("#dynamic_load").parent("div").removeClass("mobile"),$("#dynamic_load").parent("div").removeClass("mobile_portrait"),$("#dynamic_load").parent("div").removeClass("tablet"),$("#dynamic_load").parent("div").removeClass("tablet_portrait"),$("#dynamic_load").parent("div").removeClass("zoomIn"),$("#dynamic_load").parent("div").removeClass("custom-frame"),$("#dynamic_load").parent("div").hide(),$("#dynamic_load").css({height:"",width:""}),$(".widgetFrame").hide(),"custom"==e)width=$("#preview_width").val(),t=$("#preview_height").val(),$("#dynamic_load").parent("div").addClass("custom-frame"),$("#dynamic_load").css({height:t+"px",width:width+"px"}),$("iframe").css("height",t+"px");else{$("#preview_width").val(""),$("#preview_height").val(""),$("#dynamic_load").parent("div").addClass(e);var t=$("#dynamic_load").css("height");t=parseInt(t.replace("px","")),$("iframe").css("height",t+"px")}$(".preview-screen a").removeClass("active"),$(".preview-screen a.preview_"+e).addClass("active"),$("#dynamic_load").parent("div").show(),$("#dynamic_load").parent("div").addClass("zoomIn"),$(".widgetFrame").show()}function updateChatbotStatus(e,t,o){return $("#confirmTitle").html("Confirm Action"),$("#ConfirmMsgBody").html("Are you sure you want to "+e+" this chatbot?"),$("#ConfirmPopupArea").modal({backdrop:"static",keyboard:!1}).one("click","#confirmYes",function(a){a.preventDefault(),$.ajax({url:jsVars.FULL_URL+"/chatbots/chatbot-status",type:"post",dataType:"html",data:{status_text:e,w_id:t,c_id:o},headers:{"X-CSRF-Token":jsVars._csrfToken},beforeSend:function(){$("div.loader-block").show()},complete:function(){$("div.loader-block").hide()},success:function(t){if("session_logout"===t)return window.location.reload(!0),!1;"error"==t?alertPopup("Getting problem while updating status: "+e+"d.","error"):(alertPopup("Chatbot has been "+e+"d.","success"),LoadChatbotData("reset"),LoadReportDateRangepicker())},error:function(e,t,o){console.log(o+"\r\n"+e.statusText+"\r\n"+e.responseText)}}),$("#ConfirmPopupArea").modal("hide")}),!1}function getCode(e){return $.ajax({url:jsVars.FULL_URL+"/chatbots/get-code",type:"post",dataType:"html",data:{w_id:e},headers:{"X-CSRF-Token":jsVars._csrfToken},beforeSend:function(){$("div.loader-block").show()},complete:function(){$("div.loader-block").hide()},success:function(e){return"session_logout"===e?(window.location.reload(!0),!1):"error"==e?(window.location.reload(!0),!1):(alertPopup(e,"success","javascript:void(0)"),$("#SuccessPopupArea").addClass("modalCustom"),$("#SuccessPopupArea #alertTitle").html("Embed JS Code"),void $("#SuccessPopupArea #OkBtn").hide())},error:function(e,t,o){console.log(o+"\r\n"+e.statusText+"\r\n"+e.responseText)}}),!1}function exportChatbotCsv(){var e=$("#FilterChatbotList");e.attr("action",jsVars.exportChatbotCsvLink),e.attr("target","modalIframe");var t=e.attr("onsubmit");e.removeAttr("onsubmit"),$("#myModal").modal("show"),e.submit(),e.attr("onsubmit",t),e.removeAttr("target")}$(document).ready(function(){if($('[data-toggle="popover"]').popover(),$('[data-toggle="tooltip"]').tooltip(),$("#create-widget-step-one").length>0&&$(".select_field").on("click",function(e){$("#select_all").attr("checked",!1)}),$("#accordion").length>0){var e=$("#accordion").offset().top-180;$(".panel").on("hide.bs.collapse",function(t){$(this).find(".more-less").toggleClass("fa-angle-down fa-angle-up"),$(this).find(".panel-collapse").removeClass("animated fadeIn"),$("html, body").animate({scrollTop:e})}),$(".panel").on("show.bs.collapse",function(t){$(this).find(".more-less").toggleClass("fa-angle-down fa-angle-up"),$(this).find(".panel-collapse").addClass("animated fadeIn"),$("html, body").animate({scrollTop:e})})}$("#create-widget-step-three").length>0&&($("#nestable3").nestable(),$("#nestable").nestable(),$(document).ready(function(){$(document).on("change",":file",function(){var e=$(this),t=e.get(0).files?e.get(0).files.length:1,o=e.val().replace(/\\/g,"/").replace(/.*\//,"");e.trigger("fileselect",[t,o])}),fileSelectShow()})),$(document).on("click",".removeJsContainer",function(){$(this).parents(".upload_js_file-blk").remove(),$(".upload-js-lable:first").show(),1==$(".upload_js_file-blk").length&&$(".removeJsContainer").remove()}),$(document).on("click",".AddMoreJs",function(){var e=$(".upload_js_file-blk").length;if($(".upload_js_added-blk").length+e<10){var t=$(".upload_js_file-blk:first").clone();$(t).find(":text").val(""),$(this).parents(".upload_js_file-blk").after(t),$(".removeJsContainer").remove(),$(".AddMoreJs").after('<button class="btn-info btncustom removeJsContainer" type="button"><i aria-hidden="true" class="fa fa-minus"></i></button>'),$(".upload-js-lable").hide(),$(".upload-js-lable:first").show(),fileSelectShow()}else alertPopup("A maximum of 10 Js can be uploaded.","error"),$("#ErroralertTitle").html("Js Upload Maximum Limit reached")}),$(document).on("click",".removeCssContainer",function(){$(this).parents(".upload_css_file-blk").remove(),$(".upload-css-lable:first").show(),1==$(".upload_css_file-blk").length&&$(".removeCssContainer").remove()}),$(document).on("click",".AddMoreCss",function(){var e=$(".upload_css_file-blk").length;if($(".upload_css_added-blk").length+e<5){var t=$(".upload_css_file-blk:first").clone();$(t).find(":text").val(""),$(this).parents(".upload_css_file-blk").after(t),$(".removeCssContainer").remove(),$(".AddMoreCss").after('<button class="btn-info btncustom removeCssContainer" type="button"><i aria-hidden="true" class="fa fa-minus"></i></button>'),$(".upload-css-lable").hide(),$(".upload-css-lable:first").show(),fileSelectShow()}else alertPopup("A maximum of 5 CSS can be uploaded.","error"),$("#ErroralertTitle").html("CSS Upload Maximum Limit reached")}),$(".sumo-select").length&&$(".sumo_select").SumoSelect({placeholder:"Select Value",search:!0,searchText:"Search reportees",selectAll:!0,captionFormatAllSelected:"All Selected.",triggerChangeCombined:!1}),$(document).on("click",".checkboxSpace",function(){var e=$(this).attr("data"),t=$(this).attr("alt"),o=0,a=0;if("course_id"==e){$(".class_"+e).each(function(){$(this).is(":checked")&&o++}),$(".child_class_"+e+"_"+t).each(function(){$(this).is(":checked")&&a++}),$("#parentId"+t).is(":checked")||$(".child_class_"+e+"_"+t).prop("checked",!1);var n=0;1==a&&1==o&&(n=o+a),2==n?$("#autoSaveId"+e).show():($("#autoSaveId"+e).hide(),$("#autoSaveIdCheckbox"+e).prop("checked",!1))}else{var r=0;$(".class_"+e).each(function(){$(this).is(":checked")&&r++}),1==r?$("#autoSaveId"+e).show():($("#autoSaveId"+e).hide(),$("#autoSaveIdCheckbox"+e).prop("checked",!1))}}),$("#form_mapping_by_registration_field_div").length&&disableSelectedRegistrationField(),sumoDropdown()});var downloadWidgetFile=function(e){window.open(e,"_self")};function publishChatbot(e){return $("#ConfirmMsgBody").html("Are you sure to publish this chatbot?"),$("#ConfirmPopupArea").modal({backdrop:"static",keyboard:!1}).one("click","#confirmYes",function(t){t.preventDefault(),$.ajax({url:jsVars.FULL_URL+"/chatbots/publish-chatbot",type:"post",dataType:"html",data:{w_id:e},headers:{"X-CSRF-Token":jsVars._csrfToken},beforeSend:function(){$("div.loader-block").show()},complete:function(){$("div.loader-block").hide()},success:function(e){return"session_logout"===e?(window.location.reload(!0),!1):"error"==e?(window.location.reload(!0),!1):(alertPopup("Chatbot has been published successfully..","success",location),$("#SuccessPopupArea #alertTitle").html("Success"),$("#SuccessPopupArea #OkBtn").attr("href",location),void $("#SuccessPopupArea #OkBtn").show())},error:function(e,t,o){console.log(o+"\r\n"+e.statusText+"\r\n"+e.responseText)}}),$("#ConfirmPopupArea").modal("hide")}),!1}function selectMandatory(e){1==$("#all_"+e).prop("checked")?($("#man_"+e).attr("checked","checked"),$("#man_"+e).prop("checked",!0)):$("#man_"+e).removeAttr("checked")}function selectText(e){var t,o,a=document.getElementById(e);window.getSelection&&document.createRange?""==(t=window.getSelection()).toString()&&window.setTimeout(function(){(o=document.createRange()).selectNodeContents(a),t.removeAllRanges(),t.addRange(o)},1):document.selection&&""==(t=document.selection.createRange()).text&&((o=document.body.createTextRange()).moveToElementText(a),o.select())}function copyToClipboard(e){selectText(e);var t=$("<input>");$("body").append(t),t.val($("#"+e).text()).select(),document.execCommand("copy"),t.remove()}function dropdownMenuPlacement(){var e;$(".ellipsis-left").on("show.bs.dropdown",function(t){e=$(t.target).find(".dropdown-menu"),dropHeight=e.outerHeight()-50,$("body").append(e.detach());var o=$(t.target).offset(),a=o.top-dropHeight;e.css({display:"block",top:a<0?0:a,left:o.left-135})}),$(".ellipsis-left").on("hide.bs.dropdown",function(t){$(t.target).append(e.detach()),e.hide()})}function determineDropDirection(){$(".ellipsis-left .dropdown-menu").each(function(){$(this).css({visibility:"hidden",display:"block"}),$(this).parent().removeClass("dropup"),$(this).offset().top+$(this).outerHeight()>$(window).innerHeight()+$(window).scrollTop()&&$(this).parent().addClass("dropup"),$(this).removeAttr("style")})}function alertPopup(e,t,o){if("error"===t)var a="#ErrorPopupArea",n="#ErroralertTitle",r="#ErrorMsgBody",s="#ErrorOkBtn",l="Error";else a="#SuccessPopupArea",n="#alertTitle",r="#MsgBody",s="#OkBtn",l="Success";$(n).html(l),$(r).html(e),$(".oktick").hide(),void 0!==o?($(s).show(),$(a).modal({keyboard:!1}).one("click",s,function(e){e.preventDefault(),window.location.href=o})):$(a).modal()}function LoadReportDateRangepicker(e,t){void 0===e&&(e="left"),void 0===t&&(t="down"),$(".daterangepicker_report").daterangepicker({showDropdowns:!0,showWeekNumbers:!0,autoUpdateInput:!1,locale:{format:"DD/MM/YYYY",separator:", "},ranges:{Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]},opens:e,drops:t},function(e,t,o){}),$(".daterangepicker_report").on("apply.daterangepicker",function(e,t){$(this).val(t.startDate.format("DD/MM/YYYY")+","+t.endDate.format("DD/MM/YYYY"))}),$(".daterangepicker_report").on("cancel.daterangepicker",function(e,t){$(this).val("")}),$(".daterangepicker_report_left_up").daterangepicker({showDropdowns:!0,showWeekNumbers:!0,autoUpdateInput:!1,locale:{format:"DD/MM/YYYY",separator:", "},ranges:{Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]},opens:"left",drops:"up"},function(e,t,o){}),$(".daterangepicker_report_left_up").on("apply.daterangepicker",function(e,t){$(this).val(t.startDate.format("DD/MM/YYYY")+","+t.endDate.format("DD/MM/YYYY"))}),$(".daterangepicker_report_left_up").on("cancel.daterangepicker",function(e,t){$(this).val("")}),$(".daterangepicker_report_right").daterangepicker({showDropdowns:!0,showWeekNumbers:!0,autoUpdateInput:!1,locale:{format:"DD/MM/YYYY",separator:", "},ranges:{Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]},opens:"right"},function(e,t,o){}),$(".daterangepicker_report_right").on("apply.daterangepicker",function(e,t){$(this).val(t.startDate.format("DD/MM/YYYY")+","+t.endDate.format("DD/MM/YYYY"))}),$(".daterangepicker_report_right").on("cancel.daterangepicker",function(e,t){$(this).val("")}),$(".daterangepicker_report_center").daterangepicker({showDropdowns:!0,showWeekNumbers:!0,autoUpdateInput:!1,locale:{format:"DD/MM/YYYY",separator:", "},ranges:{Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]},opens:"center"},function(e,t,o){}),$(".daterangepicker_report_center").on("apply.daterangepicker",function(e,t){$(this).val(t.startDate.format("DD/MM/YYYY")+","+t.endDate.format("DD/MM/YYYY"))}),$(".daterangepicker_report_center").on("cancel.daterangepicker",function(e,t){$(this).val("")})}$(function(){$("#fullscreen .requestfullscreen").click(function(){return $("#fullscreen").fullscreen(),!1}),$("#fullscreen .exitfullscreen").click(function(){return $.fullscreen.exit(),!1}),$(document).bind("fscreenchange",function(e,t,o){$.fullscreen.isFullScreen()?($("#fullscreen").css("padding","20px 10%"),$("#fullscreen > h4").css("color","#fff"),$("#fullscreen .requestfullscreen").hide(),$("#fullscreen .exitfullscreen").show()):($("#fullscreen").css("padding","0px"),$("#fullscreen > h4").css("color","#111"),$("#fullscreen .requestfullscreen").show(),$("#fullscreen .exitfullscreen").hide())})});