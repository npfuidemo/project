function hideFilters()
{
    //$(".applyFilter").closest("div.btn-group").children('button').first().trigger("click");
    $(".applyFilter").closest("div.btn-group").removeClass('open')
    $(".applyFilter").closest("div.btn-group").children('button').first().attr('aria-expanded','false');
}

if ($(".filter_university_id").length) 
{
    $(".filter_university_id").each(function()
    {
        var parent_id = $(this).attr('data-id');
        $("#" + parent_id + "_university_id").change(getDropdownList);
        $("#" + parent_id + "_course_id").attr('data-dependant',1);
    });
}

if($('.filter_specialization_id option').length)
{
    $(".filter_specialization_id").each(function()
    {
        if($(this).children('option').length == 1)
        {
            var parent_id = $(this).attr('data-id');
            $("#" + parent_id + "_course_id").change(getDropdownList);
            $("#" + parent_id + "_specialization_id").attr('data-dependant',1);
        }
    });
}

function getDropdownList () 
{
    var placeholder = ref_id = '';
    var el_id = $(this).attr('id');
    var parent_id = $(this).attr('data-id');
    
    if(el_id.indexOf('course') != -1)
    {
        placeholder = 'Specialization';
        ref_id = parent_id + '_specialization_id';
    }else{
        placeholder = 'Course';
        ref_id = parent_id + '_course_id';
        if($("#" + parent_id + "_specialization_id").attr('data-dependant') == 1)
        {
            $("#" + parent_id + "_specialization_id").html("");
            $("#" + parent_id + "_specialization_id")[0].sumo.reload();
        }
    }
    if($("#"+ref_id).length)
    {
        var dependant = $("#"+ref_id).attr('data-dependant');
        if(dependant == '0')
        {
            return false;
        }
        $("#"+ref_id).html("");
        $("#"+ref_id)[0].sumo.reload();
        var value = $("#"+el_id).val();
        if (value !== "") 
        {
            $.ajax({
                url: '/analytics/getCourseList/' + value,
                type: 'get',
                dataType: 'html',
                headers: {
                    "X-CSRF-Token": jsVars._csrfToken
                },
                beforeSend: function () {
                },
                complete: function () {
                    $('#'+ parent_id + 'DashletHTML .panel-loader').hide();
                    $('#'+ parent_id + 'DashletHTML .panel-heading, #'+ parent_id + 'DashletHTML .panel-body').removeClass('pvBlur');
                },
                success: function (response) {
                    var responseObject = $.parseJSON(response);
                    if (responseObject.status == 1) 
                    {
                        if (typeof responseObject.data === "object") 
                        {
                            $("#"+ref_id).append("<option value=''>Select " + placeholder + "</option>"); 
                            $.each(responseObject.data, function (formStage, formStageLabel) {
                                $("#"+ref_id).append("<option value='" + formStage + "'>" + formStageLabel + "</option>");
                            });
                            $("#"+ref_id)[0].sumo.reload();
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
        }
        
    }
}

function dashletPopupScroll(){
	var dahletContainerHeight = jQuery(window).height() - 150; 
	jQuery('.dashletsContainer').css({
		'max-height' : dahletContainerHeight,
		'overflow-y': 'auto'
	});
}
if (document.documentElement.clientWidth < 992) {
	$('#addDashletModal').on('shown.bs.modal', function (e) {
	  dashletPopupScroll();
	});
	$('#addDashletModal').on('hide.bs.modal', function (e) {
	   jQuery('.dashletsContainer').css({
			'max-height' : '100%',
			'overflow-y': 'auto'
		});
	});
}
