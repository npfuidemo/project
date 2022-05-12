$(document).ready(function(){
    $(".chosen-select").chosen();
    $('#manageFieldsLoader').hide();
    $("#collegeId").change(changeCollege);
    $('.select_field').on('click' ,function(e) {
        $('#select_all').attr('checked',false);
    });
    
    $(".erroralert").delay(5000).slideUp(300);
    $(".successalert").delay(5000).slideUp(300);
    
});


function selectAll(elem){
    if(elem.checked){
        $('.select_field').not(".disable-check").each(function(){
            this.checked = true;
        });
    }else{
        $('.select_field').not(".disable-check").attr('checked',false);
    }
}


function changeCollege(){
    var searchForm      = '<select name="form_id" id="form_id" class="chosen-select" tabindex="-1"><option selected="selected" value="">Search Form</option></select>';
    $('#searchFormDiv').html(searchForm);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    
    if($("#collegeId").val()==''){
        return;
    }
    $.ajax({
        url: jsVars.getCollegeFormLink,
        type: 'post',
        data: {college_id:$("#collegeId").val(), 'default_val' : '', 'mutliselect' : ''},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#manageFieldsLoader.loader-block').show();
        },
        complete: function () {
            console.log('m i here');
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#manageFieldsLoader.loader-block').hide();
        },
        success: function (response) {    
            $('#searchFormDiv').html(response);
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function submitForm(){
    if($("#collegeId").val()==""){
        $('#listingContainerSection').html('<div class="alert alert-danger">Please select institute to view fields.</div>');
        return;
    }
    if($("#form_id").val()=="" || $("#form_id").val() == 0){
        $('#listingContainerSection').html('<div class="alert alert-danger">Please select form to view fields.</div>');
        return;
    }
    $("#filterScoringFieldsForm").submit();    
}
