$(document).ready(function() {
      
});

function imagesPreview(input, placeToInsertImagePreview){
    if (input.files) {
        $(placeToInsertImagePreview).html('');
        var filesAmount = input.files.length;
        var fileExtension = ['jpeg', 'jpg', "png", 'gif'];
        for (i = 0; i < filesAmount; i++) {
            var filenameext = input.files[i].name.split('.').pop();
            if ($.inArray(filenameext, fileExtension) > -1) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    //$(placeToInsertImagePreview).attr('src', event.target.result);
                    $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
                }
                reader.readAsDataURL(input.files[i]);
            }else{
                $(placeToInsertImagePreview).append("<div><strong>"+input.files[i].name+"</strong></div><br>");
            }
        }
    }
}

function UploadFiles(field_id,max_upload,form_id,upload_format, max_file_size,elem){
     var enableAjax = 0;
      if(CheckFilesSelectedByFieldId(field_id,max_upload)==true){
            return false;
      }else if(CheckFilesFormatByFieldId(field_id,upload_format)==true){
            return false;
      }else if(CheckFilesSizeByFieldId(field_id,max_file_size)==true){
            return false;
      }
      else{
            $('.file-loader-block').show();
            imagesPreview(elem, "#preview_"+field_id);
            if(enableAjax===1){
                ajaxUploadFiles(form_id,field_id,max_upload);
            }
            else{
                $('#'+form_id+' input[name="current_file_upload_id"]').val(field_id);
                $('#'+form_id+' input[name="current_file_max_no_files"]').val(max_upload);
                $('#'+form_id).submit();
            }

            $('#percent_progress').html("1%");
            $('#percent_progress').css("width","1%");
            //LoadFileProgressBar(field_id);
            
            $('#'+form_id+' input[name="current_file_upload_id"]').val("");
            $('#'+form_id+' input[name="current_file_max_no_files"]').val('');
            $('#otherError_'+field_id).hide();
            // remove the id from the required fields of files
            var index = max_file_field.indexOf(field_id);
            //$('#'+field_id).val('');
            $('#'+field_id).attr('data-file_status','already_upload');
            if(index>-1){
                max_file_field.splice(index, 1);  
                max_no_files.splice(index, 1); 
            }
           
        }
        return true;
  }
  
  function CheckFilesSelectedByFieldId(field_id,max_upload){
    var flag=false;
    if(field_id!=""){
        var max=parseInt(max_upload);
        var len=$('#'+field_id).get(0).files.length;
        if(max>=1){
            var existingNofFiles   = $("div."+field_id).find("#list_files_"+field_id+" li").length;
            if(!existingNofFiles && $("#total_files_"+field_id).length){
                existingNofFiles    = $.trim($("#total_files_"+field_id).html());
            }
            len = parseInt(len)+parseInt(existingNofFiles);
        }
        if(len>max){
             flag=true;
             $('#requiredError_'+field_id).hide();
             $('#otherError_'+field_id).show();
             $('#otherError_'+field_id).html("Maximum Files allowed is : "+max);
             $('#'+field_id).val("");
        }
    }
   return flag;
}

function CheckFilesFormatByFieldId(field_id,upload_format){
    var flag=false;
    
    if(field_id!="" && upload_format!=""){

        // convert string to array
        var upload_format_ar = upload_format.split(',');

        var file_length=$('#'+field_id).get(0).files.length;
        var file_info=$('#'+field_id).get(0).files;

        if(typeof file_info != 'undefined'){
          for(var i=0; i<file_length; i++){
            var filename = file_info[i].name;
            var ext = filename.split('.').pop().toLowerCase();
           // check if ext find in array
           if(upload_format_ar.indexOf(ext) == -1){
             flag=true;
             $('#requiredError_'+field_id).hide();
              $('#otherError_'+field_id).show();
              $('#otherError_'+field_id).html("Files Format allowed is : "+upload_format);
           }
          }  
        }

    }
    // if error found
    if(flag==true){
      $('#'+field_id).val("");
    }
   return flag;
}

function CheckFilesSizeByFieldId(field_id,max_file_size){
        var flag = false;
    var kbsize = max_file_size;
    max_file_size = max_file_size * 1024;
    var maxFilenameLength = 150;
    if (field_id != "" && max_file_size != "" && max_file_size > 0) {

        var file_length = $('#' + field_id).get(0).files.length;
        var file_info = $('#' + field_id).get(0).files;
        if (typeof file_info != 'undefined') {
            for (var i = 0; i < file_length; i++) {
                var filesize = file_info[i].size;
                var filename = file_info[i].name;

                if (filename.length > maxFilenameLength) {
                    flag = true;
                    $('#requiredError_' + field_id).hide();
                    $('#otherError_' + field_id).show();
                    $('#otherError_' + field_id).html("File name should not be greater than " + maxFilenameLength +" characters.");
                } else if (filesize > max_file_size) {
                    flag = true;
                    $('#requiredError_' + field_id).hide();
                    $('#otherError_' + field_id).show();
                    $('#otherError_' + field_id).html("Max file size allowed is : " + kbsize + ' KB');

                }
            }
        }
                            

        }
        // if error found
        if(flag==true){
          $('#'+field_id).val("");
        }
       return flag;
}

function saveReuploadDocument(Form){
    //$("#reuploadDocForm").submit();
    $('form#'+Form).ajaxSubmit({
        type: 'post',
        dataType:'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('div.loader-block').show();
        },
        complete: function() {
            $('div.loader-block').hide();
        },
        success:function (json){
            if (json['redirect']) {
                location = json['redirect'];
            }
            else if(json['error']){
                for(var field_id in json['error']) {
                    $('#requiredError_' + field_id).hide();
                    $('#otherError_' + field_id).show();
                    $('#otherError_' + field_id).html(json['error'][field_id]);
                }
            }
            else if(json['success'] == 200)
            {
                location = json['location'];
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        },
        resetForm: false
    });
    return false;
    
}