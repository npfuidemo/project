
//datetimepicker

    $('.datetimepicker').datetimepicker({
        icons: {
           time: "fa fa-clock-o",
           date: "fa fa-calendar",
           up: "fa fa-chevron-up",
           down: "fa fa-chevron-down",
           previous: 'fa fa-chevron-left',
           next: 'fa fa-chevron-right',
           today: 'fa fa-screenshot',
           clear: 'fa fa-trash',
           close: 'fa fa-remove'
        }
     });

// Sidebar Menu

     $("[data-toggle='sidebar']").click(function () {
        $('body').toggleClass('sidebar-collapse');
        $('#sidebar-wrapper').toggleClass('active');
     })

     $('.clickableClass').click(function () {
        $('.mainList li').removeClass('active');
        $(this).parent().addClass('active');
     });
     $(".sidebar").find("li").on("click", "a[data-toggle]", function () {
        $(this).parent().siblings().find('.collapse').collapse('hide');
     });

     function openNav() {
        document.getElementById("mobile-slide").style.width = "75%";
        document.getElementById("mobile-slide").style.left = "0";
        document.getElementById("myCanvasNav").style.width = "100%";
        document.getElementById("myCanvasNav").style.opacity = "1";
        document.body.classList.add("bodyFrizze");
        //document.getElementById("right-content").style.marginLeft = "0";
     }

     function closeNav() {
        document.getElementById("mobile-slide").style.width = "0";
        document.getElementById("mobile-slide").style.left = "-50px";
        document.getElementById("myCanvasNav").style.width = "0";
        document.getElementById("myCanvasNav").style.opacity = "0";
        document.body.classList.remove("bodyFrizze");
        //document.getElementById("right-content").style.marginLeft= "0";
     }

//zendesk

// zE('webWidget', 'prefill', {
//     email: {
//        value: 'narendra@nopaperforms.com',
//        //readOnly: true // optional
//     },
//     name: {
//        value: 'NPF Automation',
//        //readOnly: true // optional
//     }
//  });
//  window.zESettings = {
//     webWidget: {
//        position: {
//           horizontal: 'right', vertical: 'bottom',
//        },
//        offset: {
//           horizontal: '-12px',
//           vertical: '-12px',
//        },
//        /*color: {
//           theme: '#75b740',
//           launcher: '#75b740',
//           launcherText: '#fff',
//           button: '#75b740',
//           resultLists: '#75b740',
//           header: '#75b740',
//           articleLinks: '#FF4500'
//        },*/
//        launcher: {
//           mobile: {
//              labelVisible: false
//           }
//        }
//     }
//  };
//  var myVar;
//  zE('webWidget:on', 'open', function () {
//     myVar = setInterval(removeZndeskIconTimer, 100)
//  });

//  zE('webWidget:on', 'close', function () {
//     stopRemoveZndeskIconTimer();
//  });

//  function removeZndeskIconTimer() {
//     var $iframe = $('#webWidget');
//     var $emailParent = $iframe.contents().find("input[name='email']").parent();
//     $emailParent.find('small#emailMsg').remove();
//     $emailParent.append('<small id= "emailMsg" style="color:#004085">our team will get back to you on this email id</small>');
//     $iframe.contents().find("svg#Layer_1").remove();
//  }

//  function stopRemoveZndeskIconTimer() {
//     clearInterval(myVar);
//  }
//  zE('webWidget', 'helpCenter:setSuggestions', { search: 'Admin Dashboard' });

 function vimeoVideo(){
	var iframes = $('.vimeovideo'),
    status = $('.status');
	iframes.each(function() {
	  var player=$(this);
	  player.api("pause");
	});
	return false;
}

// Genric Popup modal for Videos
function vimeoSrcVideoGenric(element){
	var dataId = $(element).attr('data-id');
	var vimeodataSrc = $(element).attr('data-src');
	var vimeoSrc = $('#'+dataId+ ' iframe.vimeovideo').attr('src');
	if(vimeoSrc == '' || vimeoSrc =='../static/backend/images/blank.gif'){
		$('#'+dataId+ ' iframe.vimeovideo').attr('src', vimeodataSrc);
		return false;
	}
}

$('.modalvideoGenric').on('hidden.bs.modal', function (e) {
	$('.modalvideoGenric .vimeovideo').attr('src', '');
	vimeoVideo();
});