$(document).ready(function(){
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
  
});

$(document).on('click', '#upload_csv', function(e) {
    var fileName = $("#benchmark_file").val();
    if(fileName == ''){
	$("#csv_file_error").text('select file');
	return;
    }else{
	$("#ajaxUploadBenchmarkForm").submit();
    }
});

$(document).on('change', '#benchmark_file', function(e) {
    var fileName = e.target.files[0].name;
    $("#filePath").text(fileName);
    $("#csv_file_error").text('');
});

function checkBenchmarkingData(Form)
{  
    var formData = $('#benchmarkingData').serializeArray();
    $("#data_already_exists").html("");
    $.ajax({
        url: '/form/ajaxUploadBenchmark/'+jsVars.form_pass_id,        
        data: formData,
        dataType: "html",
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
        success: function (data) {
            if(data)
            {
               // console.log(data);
                $("#alreadyData").html(data);
            }
            else{
                $("#uploadFile").show();
            }
        },
        error: function (response) {
            //alertPopup(response.responseText);
        },
        failure: function (response) {
           // alertPopup(response.responseText);
        }
    });
} 

function downloadSampleCsv(type){
    var form_id	    = $("#form_id").val();
    if (form_id>0) {
        $.ajax({
            url: jsVars.downloadSampleApplicationLink,
            type: 'post',
            data: {form_id: form_id},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () { 
            },
            complete: function () {
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
                       downloadLeadFile(downloadUrl);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
        
    } else {
        if($("#form_id").val() =='') {
            $("#form_id_error").html("Please select forms");
        }
    }
}

var downloadLeadFile = function(url){
    window.open(url, "_self");
};


