$("document").ready(function() {
    $("#index").change(function(){
        $("#applicantIdDiv").hide();
        $("#ticketIdDiv").hide();
        $("#communicationIdDiv").hide();
        $("#ivrIdDiv").hide();
        switch ($("#index").val()) {
            case 'applicants':
                $("#applicantIdDiv").show();
                break;
            case 'tickets':
                $("#ticketIdDiv").show();
                break;
            case 'communications':
                $("#communicationIdDiv").show();
                break;
            case 'ivr':
                $("#ivrIdDiv").show();
                break;
        }
    });
});

