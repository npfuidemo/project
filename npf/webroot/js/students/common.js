$(document).ready(function(){
	$('.main-content').addClass('fadeIn');
    if ($('.chosen-select').length > 0){
        $('.chosen-select').chosen();
        $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
        $('.chosen-select').trigger('chosen:updated');
    }
    $('[data-toggle="popover"]').popover();
	
	//Custome file path
    $('#ticketDetailsAttachment').change(function(){
        var fileName = $(this).val().replace(/C:\\fakepath\\/i, '');
        $('.fileName').text(fileName);
    });
	$('#attachment').change(function(){
        var fileName = $(this).val().replace(/C:\\fakepath\\/i, '');
        $('.form-browse-control').val(fileName);
    });
    $('.msg_success').show().delay(2000).fadeOut();
    $('.msg_error,#msg_error').show().delay(10000).fadeOut();
	
	  var sideWidth = $('.sidebar').width();
	  $('.nav-sidebar').css('width', sideWidth);
	  var $sticky = $('.nav-sidebar');
	  var $stickyrStopper = $('.footer');
	  if (!!$sticky.offset()) { // make sure ".sticky" element exists

		var generalSidebarHeight = $sticky.innerHeight();
		var stickyTop = $sticky.offset().top;
		var stickOffset = 55;
		var stickyStopperPosition = $stickyrStopper.offset().top;
		var stopPoint = stickyStopperPosition - generalSidebarHeight - stickOffset;
		var diff = stopPoint + stickOffset;

		$(window).scroll(function(){ // scroll event
		  var windowTop = $(window).scrollTop(); // returns number

		  if (stopPoint < windowTop) {
			  $sticky.css({ position: 'fixed', top: stickOffset });
		  } else if (stickyTop < windowTop+stickOffset) {
			  $sticky.css({ position: 'fixed', top: stickOffset });
		  } else {
			  $sticky.css({position: 'fixed', top: stickOffset});
		  }
		});
	  }
        
}); 

var myObj = $('.table-header');
if (myObj.length){
	var npfForm = myObj.offset().top;
}	

function tableHeadFixed(){
	if ($(this).scrollTop() > npfForm) {
		myObj.parent().addClass('tableHeadFix');
	} else {
		myObj.parent().removeClass('tableHeadFix');
	}	
};

$(window).scroll(function () {
	tableHeadFixed();
});		

		
// FAQ's icons
function toggleIcon(e) {
	$(e.target)
	.prev('.panel-heading')
	.find(".more-less")
	.toggleClass('glyphicon-plus glyphicon-minus');
}
$('.panel-group').on('hidden.bs.collapse', toggleIcon);
$('.panel-group').on('shown.bs.collapse', toggleIcon);


function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
   
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

$(window).load(function(){
	$('.newLoader').hide();
});


if($('#studentsEmailVerifyLinkDiv').length>0) {
    $("body").addClass('studentsEmailVerifyLinkClass');
}

function resendVerificationMail(em,ul) {
    
    if(typeof em=='undefined' || em==0 || em==null) {
        return false;
    }
    
    if(typeof ul=='undefined' || ul==0 || ul==null) {
        return false;
    }
    
    $.ajax({
        url: ul,
        type: 'post',
        data: {action:'mail',userId:em,'forcefully':'1'},
        dataType: 'json',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function() {
            $('div.newLoader').show();
            $('#SaveProfileBtn').prop('disabled',true);
	},
        complete: function() {
            $('div.newLoader').hide();
            $('#SaveProfileBtn').prop('disabled',false);
        },
        success: function (json) {

            if (json['redirect'])
            {
                location = json['redirect'];
            }
            else if (json['error'])
            {
                if (json['error']['msg'])
                {
                    alertPopup(json['error']['msg'],'error');
                }                
            }
            else if (json['success'] == 200)
            {      
                alertPopup(json['msg'],'success');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
}

function alertPopup(msg, type, location) {

    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
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
    }
    else {
        $(selector_parent).modal();
    }
}


if ($('#maintenanceMode').length > 0) { 
	jQuery('body').addClass('blur');
}
