(function($) {
    "use strict";
    $(document).ready(function() {
        /*if ($('.chosen-select').length > 0){
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({ allow_single_deselect: true });
            $('.chosen-select').trigger('chosen:updated');
        }*/
        var trigger = $('.hamburger'),
            overlay = $('.overlay'),
            isClosed = false;
			trigger.click(function() {
            hamburger_cross();
        });

        function hamburger_cross() {
            if (isClosed == true) {
                overlay.hide();
                trigger.removeClass('is-open');
                trigger.addClass('is-closed');
                isClosed = false;
            } else {
                overlay.show();
                trigger.removeClass('is-closed');
                trigger.addClass('is-open');
                isClosed = true;
            }
        }
        $('[data-toggle="offcanvas"]').click(function() {
            $('#wrapper').toggleClass('toggled');
        });
        $('.overlay').click(function() {
            overlay.hide();
            $('#wrapper').removeClass('toggled');
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        });
		
        var scroll = $(document).scrollTop();
        var headerHeight = $('.npf-header').outerHeight();
        $(window).scroll(function() {
            var scrolled = $(document).scrollTop();
            if (scrolled > headerHeight) {
                $('#header').addClass('off-canvas');
            } else {
                $('#header').removeClass('off-canvas');
            }
            if (scrolled > scroll) {
                $('#header').removeClass('fixed');
            } else {
                $('#header').addClass('fixed');
            }
            scroll = $(document).scrollTop();
        });	

        // Accodian Stick to top
        $('.panel-group').on('shown.bs.collapse', function (e) {
                var offset = $('.panel.panel-default > .panel-collapse.in').offset();
                if(offset) {
					$('html,body').animate({
							scrollTop: $('.panel-title a').offset().top - 10
					}, 500); 
                }
        }); 

        //Custome file path
        $('#ticketDetailsAttachment').change(function(){
            var fileName = $(this).val().replace(/C:\\fakepath\\/i, '');
            $('.fileName').text(fileName);
        });
		
		// Arrow on accodian
		$('.panel-collapse').on('show.bs.collapse', function () {
			$(this).siblings('.panel-heading').addClass('active');
		});

		$('.panel-collapse').on('hide.bs.collapse', function () {
			$(this).siblings('.panel-heading').removeClass('active');
		});
		
        $('[data-toggle="popover"]').popover();	
    });
})(jQuery);



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
