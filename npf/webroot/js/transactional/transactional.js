$(document).ready(function(){
    sumoDropdown();
    if($('select#users').length > 0) {
        $('select#users').SumoSelect({placeholder: 'Select Users', search: true, searchText:'Select Users', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
    }
});
$(window).load(function(){
	$('#listloader').hide();
});
//$('select#users').SumoSelect({
//    locale :  ['OK', 'Cancel', 'Select All Users'],
//    selectAll: true
//});

function sumoDropdown(){
    $('#FilterEmailTemplates').find('.sumo_select').each(function(){
       this.selected = false;
       id =$(this).attr('id');
       if(id !=='items-no-show'){
          placeholder =$(this).data('placeholder');
       $('#'+id).SumoSelect({placeholder: placeholder, search: true, searchText:placeholder,  triggerChangeCombined: false });

        $('#'+id)[0].sumo.reload();
       }
    });
}

//load multiple users of multiple groups
function loadGroupAssociatedUsersList(rowId)
{
    var collegeId = $("#college_id").val();
    var groupId = [];
    $.each($('.'+rowId+':checkbox:checked'), function(){
	groupId.push($(this).val());
    });
    //alert(groupId);
    //alert($('.'+rowId+':checkbox:checked').val());
    $.ajax({
	url: '/transactional/get-group-associated-users-list',
	type: 'post',
	dataType: 'json',
	data: {collegeId: collegeId, groupId: groupId},
	headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
	success: function (json)
	{
	    if(json['redirect'])
	    {
		location = json['redirect'];
	    }
	    else if(json['error'])
	    {
		alertPopup(json['error'],'error');
	    }
	    else if(json['success'] == 200)
	    {
		var userList    = json['UsersList'];
		var value   = '';
		$.each(userList, function (group, result) {
		    value   += '<option selected="selected" value="'+group+';;;0">All '+group+'</option>';
		    $.each(result, function (index, item) {
			value += '<option value="'+group+';;;'+index+'">'+item+'</option>';
		    });
		});

		$('#users').html(value);
		$('select#users').SumoSelect({placeholder: 'Select Users', search: true, searchText:'Select Users', captionFormatAllSelected: "All Selected.", triggerChangeCombined: true });
		$('select#users')[0].sumo.reload();
	    }
        dropdownMenuPlacement();
	},
	error: function (xhr, ajaxOptions, thrownError) {
	    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	}
    });
}

//alert popup
function alertPopup(msg, type, location) {
    var selector_parent, selector_titleID, selector_msg, title_msg, btn;
    if (type == 'error') {
        selector_parent = '#ErrorPopupArea';
        selector_titleID = '#ErroralertTitle';
        selector_msg = '#ErrorMsgBody';
        btn = '#ErrorOkBtn';
        title_msg = 'Error';
    } else {
        selector_parent = '#SuccessPopupArea';
        selector_titleID = '#alertTitle';
        selector_msg = '#MsgBody';
        btn = '#OkBtn';
        title_msg = 'Success';
    }

    $(selector_titleID).html(title_msg);
    $(selector_msg).html(msg);
    $('.oktick').hide();

    if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}