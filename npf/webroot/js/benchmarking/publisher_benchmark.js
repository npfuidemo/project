$(document).on('click', '#upload_csv', function(e) {
    var fileName = $("#benchmark_file").val();
    if(fileName == ''){
	$("#csv_file_error").text('select file');
	return;
    }else{
	$("#ajaxUploadPublisherBenchmarkForm").submit();
    }
});

$(document).on('change', '#benchmark_file', function(e) {
    var fileName = e.target.files[0].name;
    $("#filePath").text(fileName);
    $("#csv_file_error").text('');
});

function checkBenchmarkingData(Form)
{  
    $("#searchBenchmark").attr("disabled", true);
    var formData = $('#publisherBenchmarkingData').serializeArray();
    $.ajax({
        url: '/benchmarking/ajaxUploadPublisherBenchmark',
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
            $("#searchBenchmark").removeAttr("disabled"); 
        },
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }else if(data)
            {
                $("#alreadyData").html(data);
            }else{
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

function downloadSampleCsv(type) {
    var formData = $('#publisherBenchmarkingData').serializeArray();
    $.ajax({
        url: jsVars.downloadSamplePublisherCsvLink,
        type: 'post',
        data: formData,
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
                if (downloadUrl !== '' && downloadUrl !== null) {
                    downloadLeadFile(downloadUrl);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });

}

var downloadLeadFile = function(url){
    window.open(url, "_self");
};