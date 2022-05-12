var screen_width = $(window).width();
if (screen_width > 767) {
    var hidWidth;
    var scrollBarWidths = 40;

    var widthOfList = function () {
        var itemsWidth = 0;
        $('.mainList li').each(function () {
            var itemWidth = $(this).outerWidth();
            itemsWidth += itemWidth;
        });
        //alert(itemsWidth);
        return itemsWidth;
    };

    var widthOfHidden = function () {
        return (($('.wrapper').outerWidth()) - widthOfList() - getLeftPosi()) - scrollBarWidths;
    };

    var getLeftPosi = function () {
        //return $('.item:first-child').position().left;
        return $('.mainList').position().left;
    };

    var reAdjust = function () {
        if (($('.wrapper').outerWidth()) < widthOfList()) {
            $('.scroller-right').show();
        } else {
            $('.scroller-right').hide();
            /*
             var leftPos = $('.item:first-child').position().left;
             $('.item').animate({left:"-="+leftPos+"px"},'slow');
             */
        }

        if (getLeftPosi() < 0) {
            $('.scroller-left').show();
        } else {
            $('.mainList li').animate({left: "-=" + getLeftPosi() + "px"}, 'slow');
            $('.scroller-left').hide();
        }
    }

    reAdjust();

    $(window).on('resize', function (e) {
        reAdjust();
    });

    $('.scroller-right').click(function () {

        $('.scroller-left').show();
        $('.scroller-right').hide();

        $('.mainList').animate({left: "+=" + widthOfHidden() + "px"}, 'slow', function () {
            //reAdjust();
        });
    });

    $('.scroller-left').click(function () {
        //var leftPos = $('.item:first-child').position().left;
        //$('.item').animate({left:"-="+getLeftPosi()+"px"},'slow');
        //$('.scroller-left').hide();

        $('.scroller-right').show();
        $('.scroller-left').hide();

        $('.mainList').animate({left: "-=" + getLeftPosi() + "px"}, 'slow', function () {

        });

    });

	$( ".mainList .dropdown a" ).click(function( event ) {
	  event.stopImmediatePropagation();
	});
	
    $(function () {
        
        $(".mainList > li > a").hover(function () {
            0 != $(this).parents(".wrapper").length ? $(this).next().css({
                left: $(this).offset().left + "px",
                position: "fixed",
                top: "108px",
                width: "auto"
            }) : $(this).next().css({
                left: "",
                position: "",
                top: "",
                width: ""
            })
        });

        $(".mainList .dropdown").hover(
                function () {
                    $('.dropdown > .dropdown-menu', this).stop( true, true ).fadeIn("fast");
                    //$('.dropdown-menu', this).stop(true, true).fadeIn("fast");
                    $(this).toggleClass('open');
                    $('b', this).toggleClass("caret caret-up");
                },
                function () {
                    $('.dropdown >.dropdown-menu', this).stop( true, true ).fadeOut("fast");
                    //$('.dropdown-menu', this).stop(true, true).fadeOut("fast");
                    $(this).toggleClass('open');
                    $('b', this).toggleClass("caret caret-up");
                });
    });
}

//menu list display by ajax
 var Page =1;
function LoadMoreMenus(){
    var loadMsg ="loading..";
    var data = $('#FilterInstituteForm').serializeArray();
    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html("Loading...");
    $.ajax({
        url: '/menu/ajax-menu-list',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        success: function (data) {
            $('button[name="search_btn"]').removeAttr('disabled');
            Page = Page + 1;
            $('#load_more_button').removeAttr("disabled");
             $("#page").val(Page);
            if (data == "session_logout") {
                window.location.href = '/colleges/login';
            }else if (data == "no_data_found") {
                
               $('#load_more_results').append('<tr class="font-icon-hover table-responsive"><td colspan="3"><div class="alert alert-danger">No More Records</div></td></tr>');
               $("#load_more_button").hide();
            }else {
               data = data.replace("<head/>", '');
               $('#load_more_results tbody').append(data);
             }
           
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}