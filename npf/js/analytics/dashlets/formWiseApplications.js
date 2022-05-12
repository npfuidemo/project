var initilizeFormWiseApplicationsTable = function () {
    createFormWiseApplicationsTable();
};

var createFormWiseApplicationsTable = function () {
//    $("#formWiseApplicationTableDashlet").find('.dropdown-toggle').dropdown('close');
    var dashletUrl = $("#formWiseApplicationTableDashlet").data('url');
    var defaultImage = '/img/line_no_data_image.jpg';
    $("#formWiseApplicationTable_collegeId").val($("#collegeId").val());
    var filters = $("#formWiseApplicationTableFilterForm").serializeArray();
//    console.log(filters);
    $.ajax({
        url: dashletUrl,
        type: 'post',
        data: filters,
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
        },
        complete: function () {
            $('#formWiseApplicationTableDashletHTML .panel-loader').hide();
            $('#formWiseApplicationTableDashletHTML .panel-heading, #formWiseApplicationTableDashletHTML .panel-body').removeClass('pvBlur');
        },
        success: function (response) {
            var responseObject = $.parseJSON(response);
            if (responseObject.status == 1) {
                if (typeof responseObject.data === "object") {
                    updateFormWiseApplicationTable(responseObject.data);
                }
            } else {
                if (responseObject.message === 'session') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                    alertPopup(responseObject.message);
                }
            }
            return;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alertPopup(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });

};

function updateFormWiseApplicationTable(dashletData) {

    $("#formWiseApplicationsContainerDiv").html("");
    if (typeof dashletData.formWiseApplications !== "object") {
        return;
    }

    var tableRows = '';
    $.each(dashletData.formWiseApplications, function (key, applications) {
        tableRows += '<tr><td class="text-left fw-500 wsNormal">' + applications.form + '</td>';
        tableRows += '<td class="colGroup1">' + applications.total + '</td>';
        if (typeof applications.paidApplications === "object" && typeof dashletData.paymentMethods === "object") {
            $.each(dashletData.paymentMethods, function (paymentMethodKey, paymentMethod) {
                tableRows += '<td class="colGroup2">' + (typeof applications.paidApplications[paymentMethodKey] === "number" ? applications.paidApplications[paymentMethodKey] : 0) + '</td>';
            });
        }
        tableRows += '<td class="colGroup2">' + (typeof applications.paidApplications.total === "number" ? applications.paidApplications.total : 0) + '</td>';

        if (typeof applications.unpaidApplications === "object") {
            tableRows += '<td class="colGroup1">' + applications.unpaidApplications.paymentInitiated + '</td>';
            tableRows += '<td class="colGroup1">' + applications.unpaidApplications.paymentNotInitiated + '</td>';
            tableRows += '<td class="colGroup1">' + applications.unpaidApplications.total + '</td>';
        }

        tableRows += '<td class="colGroup2">' + applications.submittedApplications + '</td>';
        '\</tr>';
    });

    var headerRow = '<tr class="rowtwo">';
    //headerRow   += '<th class="colGroup2"></th>';
    var paymentMethodColspan = 1;
    var freePaidApplicationsHeader = 'Paid Applications';
    if (typeof dashletData.paymentMethods === "object") {
        $.each(dashletData.paymentMethods, function (paymentMethodKey, paymentMethod) {
            if(paymentMethodKey == 'free'){
                freePaidApplicationsHeader = 'Paid/Free Applications';
            }
            headerRow += '<th class="colGroup2 text-center fw-500">' + paymentMethod + '</th>';
            paymentMethodColspan++;
        });
    }
    headerRow += '<th class="colGroup2 text-center fw-500">Total</th>';
    headerRow += '<th class="colGroup1 text-center fw-500">Payment Initiated</th>';
    headerRow += '<th class="colGroup1 text-center fw-500">Payment Not Initiated</th>';
    headerRow += '<th class="colGroup1 text-center fw-500">Total</th></tr>';

    var table = '<table class="table table-hover mb-0"> \n\
                        <thead> \n\
                            <tr class="rowone"> \n\
                                <th rowspan="2" class="text-left" style="width:20%;background-color:#fff;">Form Name</th> \n\
                                <th rowspan="2" class="colGroup1 text-center">Total Applications</th>\n\
                                <th class="colGroup2 text-center" colspan="' + paymentMethodColspan + '">'+freePaidApplicationsHeader+'</th>\n\
                                <th class="colGroup1 text-center" colspan="3">Unpaid Applications</th>\n\
                                <th rowspan="2" class="colGroup2 text-center">Applications Submitted</th>';
                     table +=  '</tr> \n\
							' + headerRow + ' \n\
                        </thead> \n\
                        <tbody> ' + tableRows + '</tbody> \n\
                    </table>';

    $("#formWiseApplicationsContainerDiv").html(table);
    /*if($(window).width() > 967){
     var docHeight = $(document).height()- 180;
     $('.gridly').css('height', docHeight);
     }*/

}

function formWiseApplicationTable_downloadPDF() {
//    $("#formWiseApplicationTableDashletFilters").hide();

    var data = document.getElementById("formWiseApplicationTableDashletHTML");
    html2canvas(data).then(canvas => {
        // Few necessary setting options  
        var imgWidth = 200;
        var imgHeight = canvas.height * imgWidth / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        var pdf = new jspdf(); // A4 size page of PDF  
        var position = 1;
        pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
        pdf.save('download.pdf'); // Generated PDF   
//        $("#formWiseApplicationTableDashletFilters").show();
    });


}

function formWiseApplicationTable_downloadCSV() {
    $("#formWiseApplicationTableFilterForm").submit();
}

function resetFormWiseApplicationTableFiltersForm() {
    $("#formWiseApplicationTableFilterForm").find('select.dashletFilter').each(function () {
        $(this).val('');
    });
    $('.chosen-select').trigger('chosen:updated');
}

