$(document).ready(function(){
    $(".chosen-select").chosen();
    //$('#manageFieldsLoader').hide();
	$('[data-toggle="tooltip"]').tooltip(); 
    $("#collegeId").change(changeCollege);
    $('.select_field').on('click' ,function(e) {
        $('#select_all').attr('checked',false);
    });
	table_fix_rowcol();
	var clgName = $( "#collegeId option:selected" ).text();
	$('#clgName').text('('+clgName+')');
	
	$('a[aria-controls="applicationAttribute"]').click(function(){
		$('.leadAttribute').hide();
		$('.appAttribute').show();
	})
	$('a[aria-controls="listingContainerSection"]').click(function(){
		$('.leadAttribute').show();
		$('.appAttribute').hide();
	});
        
        if(jsVars.tab !='undefined' && jsVars.tab == 'application'){
            $('a[aria-controls="applicationAttribute"]').trigger('click');
        }
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
    var searchField      = '<select name="searchField" id="searchField" class="chosen-select" tabindex="-1"><option selected="selected" value="">Search Field</option></select>';
    $('#searchFieldDiv').html(searchField);
    $('.chosen-select').chosen();
    $('.chosen-select-deselect').chosen({allow_single_deselect: true});
    
    if($("#collegeId").val()==''){
        return;
    }
    $.ajax({
        url: jsVars.getRegistrationFieldsLink,
        type: 'post',
        data: {collegeId:$("#collegeId").val()},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#manageFieldsLoader.loader-block').show();
        },
        complete: function () {
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});
            $('#manageFieldsLoader.loader-block').hide();
        },
        success: function (response) {            
            var responseObject = $.parseJSON(response);
            if(responseObject.status==1){
                if(typeof responseObject.data === "object"){
                        var searchField      = '<select name="searchField" id="searchField" class="chosen-select" tabindex="-1"><option selected="selected" value="">Search Field</option>';
                        $('#searchField_chosen').html(searchField);
                        $.each(responseObject.data, function (index, item) {
                            searchField += '<option value="'+index+'">'+item+'</option>';
                        });
                        searchField += '</select>';
                        console.log(searchField);
                        $('#searchField_chosen').html(searchField);
                        $('.chosen-select').chosen();
                        $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                }
            }else{
                if (responseObject.message === 'session'){
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                }else{
                    alert(responseObject.message);
                }
            }
			var clgName = $( "#collegeId option:selected" ).text();
			$('#clgName').text('('+clgName+')');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function submitForm(){
    if($("#collegeId").val()==""){
		$('#dependentContentAjax').hide();
		$('#clgName').text('');	
        $('#listingContainerSection').html('<div id="load_msg_div"><div class="aligner-middle"><div class="text-center text-info font16"><span class="lineicon-43 alignerIcon"></span><br><span id="load_msg">Please select an Institute Name from filter and click apply to view Applications.</span></div></div></div>');
        return;
    }
	$('#manageFieldsLoader').show();
    $("#filterRegistrationFieldsForm").submit();
	$('#load_msg_div').hide();
}
