// Below function import from backend-header.js from root js folder

function ChangeSession(type,value,calledFrom="") {
    if(typeof calledFrom==="undefined"){
        calledFrom = "";
    }
    
    var refresh = true;
    var async = true;
    if(calledFrom==="onFocusEvent"){
        async = false;
        refresh = false;
    }
    var c_controller = $('.currentController').val();
    var c_method = $('.currentMethod').val();
    if(type=="college"){
        createCookie("hsclg",btoa(value),7);
    }
    $.ajax({
        url: '/common/set-college',
        type: 'post',
        dataType: 'json',
        async: async,
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "value": value,
            "type": type,
            "c_controller":c_controller,
            "c_method":c_method,
            "calledFrom":calledFrom
        },
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        success: function (data) {
            if(data.code == 200 && (data.url != '')){
                window.location.href = data.url;
            }else if(data.code == 500 && (data.message != '')){
                $('#ErroralertTitle').html('Error');
                $('#ErrorMsgBody').html(data.message);
                $('.oktick').hide();
                $('#ErrorOkBtn').show();
                $('#ErrorPopupArea').modal({keyboard: false}).one('click', '#ErrorOkBtn', function (e) {
                    e.preventDefault();
                    window.location.reload(true);
                });
            }else{
                if(refresh){
                    window.location.href = location.href;
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

var checkHeaderCollegeInProcess = false;

$(document).ready(function () {
    $('.sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
		$('body').toggleClass('activeBodyNav');
    });

	$('#nav-icon1,#nav-icon2,#nav-icon3,#nav-icon4').click(function(){
		$(this).toggleClass('open');
	});
	$(document).ajaxStop(function() {
		//alert('adefg');
		if(jQuery('.table').length>0){
			//alert('yable');
			/*setTimeout(function(){
				jQuery('.table-border').scrollLeft(1);
				//alert('scrollLeft');
			}, 100);*/
			$('.sbarCollapsebtn').on('click',function(){
				if($(this).attr('data-click-state') == 1) {
					//alert('data1');
					$(this).attr('data-click-state', 0);
					setTimeout(function(){
						jQuery('.table-border').scrollLeft(3);
						//count++;
					}, 300);
				} else {
					//alert('data0');
					$(this).attr('data-click-state', 1);
					setTimeout(function(){
						jQuery('.table-border').scrollLeft(2);
						//count++;
					}, 300);
				}
			});
		}
	})

	/*** Modal position accoding sidebar size***/
	if(jQuery('#sidebar').hasClass('active')){
		if (document.documentElement.clientWidth > 768) {
			jQuery('.modal:not(.offCanvasModal) .modal-dialog').css('left', '45px');
		}
	}


	/*$("#sidebar").hover(function () {
		$(this).toggleClass("active");
	});*/

    $(".sidebar").find("li").on("click", "a[data-toggle]", function () {
        //alert('hello');
        $(this).parent().siblings().find('.collapse').collapse('hide');
    });

	if ($('.chosen-select').length > 0){
		$(".chosen-select").chosen({disable_search_threshold: 10});
    }

    $(document).on('click', '.browse', function(){
        var file = $(this).parent().parent().parent().find('.file');
        file.trigger('click');
      });
    $(document).on('change', '.file', function(){
        $(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
    });

	/*** Sidebar Click ***/
	$('.clickableClass').click(function(){
        $('.mainList li').removeClass('active');
        $(this).parent().addClass('active');
    });


	$('#accordion').on('shown.bs.collapse', function (e) {
        var offset = $(this).find('.collapse.in').prev('.panel-heading');
        if(offset) {
            $('html,body').animate({
                scrollTop: $(offset).offset().top - 60
            }, 500);
        }
    });


	/*function setHeight() {
		windowHeight = $(window).innerHeight();
		$('.sidebar__inner').css('height', windowHeight);
	};
	setHeight();
	$(window).resize(function() {
		setHeight();
	});*/

	/*** Mobile & Tablet Screens ***/
	/*if (document.documentElement.clientWidth < 992) {
		//$('#sidebar').removeClass('active');
	}*/

	if($('.offCanvasModal').length > 0){
		$('.offCanvasModal').on('show.bs.modal', function () {
		  $('body').addClass('vScrollRemove');
		});
		$('.offCanvasModal').on('hide.bs.modal', function () {
		  $('body').removeClass('vScrollRemove');
		})
	}

	if($('.btn-group').length > 0){
		$(".btn-group button").click(function(){
			$('.chosen-select').trigger('chosen:close');
		})
	}
        
    if($("#h_college_id").length){
        window.onfocus = function() { 
            checkHeaderCollege(); 
        };
//        document.addEventListener("visibilitychange", function() {
//            if (typeof document.visibilityState!=="undefined" && document.visibilityState==="visible"){
//                checkHeaderCollege(); 
//                console.log("visibilitychanged");
//            }
//        });        
    }
    
});
function checkHeaderCollege(){
    if(checkHeaderCollegeInProcess){
        return;
    }
    checkHeaderCollegeInProcess = true;

    var headerSelectedCollegeCokkie = readCookie("hsclg");
    var headerSelectedCollegeDropdown = $("#h_college_id").val();
    if(typeof headerSelectedCollegeCokkie==="undefined" || headerSelectedCollegeCokkie == null || headerSelectedCollegeCokkie =="null" || headerSelectedCollegeCokkie==""){
        headerSelectedCollegeCokkie = 0;
    }else{
        headerSelectedCollegeCokkie = atob(headerSelectedCollegeCokkie);
    }
    if(typeof headerSelectedCollegeDropdown==="undefined" || headerSelectedCollegeDropdown == null || headerSelectedCollegeDropdown =="null" || headerSelectedCollegeDropdown==""){
        headerSelectedCollegeDropdown = 0;
    }
    if(headerSelectedCollegeCokkie!=headerSelectedCollegeDropdown){
        
        ChangeSession("college",headerSelectedCollegeDropdown,"onFocusEvent");
    }
    checkHeaderCollegeInProcess = false;
}

function createCookie(name,value,days) {
    if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    console.log(jsVars.BACKEN_DOMAIN);
    var domain = 'domain=.'+jsVars.BACKEN_DOMAIN+';';
    document.cookie = name+"="+value+expires+"; path=/;"+domain;
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

/*var sidebar = new StickySidebar('.sidebar', {
    topSpacing: 55,
    bottomSpacing: 0,
    containerSelector: '.wrapper',
    innerWrapperSelector: '.sidebar__inner'
});*/

$(".modal").appendTo("body");
// Modal Vertically Middle
function alignModal(){
    var modalDialog = $(this).find(".modal-dialog");
    // Applying the top margin on modal dialog to align it vertically center
     modalDialog.css("margin-top", Math.max(0, ($(window).height() - modalDialog.height()) / 2));
}
// Align modal when it is displayed
//$(".modal").on("show.bs.modal", alignModal);

// Align modal when user resize the window
/*$(window).on("resize", function(){
    $(".modal:visible").each(alignModal);
});*/

function addClassInSideBar(item){
    var id = item.attr('data-p');
    if(parseInt(id)>0){
        $('li[data-m = '+id+']').addClass('active');
        var item = $('li[data-m = '+id+']');
        //console.log(item);
        addClassInSideBar(item);
    }else{
        if(item.length) {
            $('.sidebar').animate({
                scrollTop: $(item).offset().top - 60
            }, 1000);
        }
	}
}
$(window).load(function() {
    item = $('ul.mainList').find('li.active');
    addClassInSideBar(item);
    $("ul.mainList li.active").each(function( index ) {
        id=$(this).data("p");
        //console.log();
        //$('a[data-am = '+id+']').trigger( "click" );
    });
});

// Common Reset function for offcanvas filter option
function filterResetModal(){
    $('.offCanvasModal input[type="text"]').each(function(){
       $(this).val('');
    });
	if($('.offCanvasModal .chosen-select').length > 0){
		$('.offCanvasModal .chosen-select').each(function(){
		   this.selected = false;
		   $(this).val('');
		   $(this).trigger("chosen:updated");
		});
	}
	if($('.offCanvasModal .sumo-select, .offCanvasModal .sumo_select').length > 0){
		$('.offCanvasModal .sumo-select, .offCanvasModal .sumo_select').SumoSelect();
		$('.offCanvasModal .sumo-select, .offCanvasModal .sumo_select').each(function(){
		   this.selected = false;
		   $(this).val('');
		   //console.log($(this).attr('class'));
		   $(this)[0].sumo.reload();
		});
		return false;
	}
}
// Common Function  For custom file
function customFile() {
	$('input[type="file"]').change(function(e){
		var fileName = e. target. files[0]. name;
		//alert('The file "' + fileName + '" has been selected.' );
		$(this).siblings('.form-control').val(fileName);
	});
}

// Flase Message hide
if($('.flashMsg').length > 0){
	setTimeout(function() {
		$('.flashMsg').fadeOut();
	}, 8000);
}

// Filter Modal in form fix layer issue
function modalFix(){
	$('.filter_btn .btn').click(function() {
	  $('#content').toggleClass('layerUnset');
	});
	$('#filter, .filterModel').on('show.bs.modal', function () {
	  $('#content').addClass('layerUnset');
	});
	$('#filter, .filterModel').on('hidden.bs.modal', function () {
	  $('#content').removeClass('layerUnset');
	});
}

function vimeoVideo(){
	var iframes = $('.vimeovideo'),
    status = $('.status');
	iframes.each(function() {
	  var player=$f(this);
	  player.api("pause");
	});
	return false;
}
function vimeoSrcVideo(element){
	var dataId = $(element).attr('data-id');
	var vimeodataSrc = $('#'+dataId+ ' iframe.vimeovideo').attr('data-src');
	var vimeoSrc = $('#'+dataId+ ' iframe.vimeovideo').attr('src');
	if(vimeoSrc == '' || vimeoSrc =='/img/blank.gif'){
		$('#'+dataId+ ' iframe.vimeovideo').attr('src', vimeodataSrc);
		return false;
	}
}
$('.modalvideo').on('hidden.bs.modal', function (e) {
	vimeoVideo();
})

// Genric Popup modal for Videos
function vimeoSrcVideoGenric(element){
	var dataId = $(element).attr('data-id');
	//var vimeodataSrc = $('#'+dataId+ ' iframe.vimeovideo').attr('data-src');
	var vimeodataSrc = $(element).attr('data-src');
	//alert(vimeodataSrc);
	var vimeoSrc = $('#'+dataId+ ' iframe.vimeovideo').attr('src');
	if(vimeoSrc == '' || vimeoSrc =='/img/blank.gif'){
		$('#'+dataId+ ' iframe.vimeovideo').attr('src', vimeodataSrc);
		return false;
	}
}

$('.modalvideoGenric').on('hidden.bs.modal', function (e) {
	vimeoVideo();
	$('.vimeovideo').attr('src', '/img/blank.gif');
})

function dragItemBox(){
	$('#dragItemBox').sortable()
    .on('sortable:receive', function(e, ui) {
      ui.item.removeClass('draggable')
    })
   // $('.draggable').draggable({ connectWith: '#rhs' })
    //$('.droppable').droppable({ activeClass: 'active', hoverClass: 'drop-here' })
}
function backendPageGuide() {
	var tourUserProfile= new Tour({
		steps: [
			{
				element: "#backend-settings",
				title: "NPF Backend",
				content: "Current lead stage of the lead, user can update the stage by clicking on edit button",
				template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><nav class='popover-navigation'><a data-role='end' href='javascript:void(0);' class='closeTour'><span class='glyphicon glyphicon-remove'><span></a></nav></div>",
				placement: "left",
			}
			],
		name : 'userProfile',
		storage: window.localStorage,
		backdrop: true,
		backdropContainer : 'body',
	});
	// Initialize the tour
	tourUserProfile.init();
	// Start the tour
	tourUserProfile.start();
}

/*if(('#backend-settings').length){
	backendPageGuide();
}*/
