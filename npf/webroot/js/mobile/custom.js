//custom javascript
  $.material.init();
  
  $('.msg_success').show().delay(10000).fadeOut();
  $('.msg_error,#msg_error').show().delay(10000).fadeOut();
  
  //hide dropdown menu on body click
$(document).on('click',function(){
    $('#menu-block, .datepicker').collapse('hide');
});

$('#menu-block').on('show.bs.collapse', function () {
  $('body').addClass('overflowHidden')
})
$('#menu-block').on('hide.bs.collapse', function () {
  $('body').removeClass('overflowHidden')
})


function createCookie(name,value,days) {
    if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
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

jQuery(function(){
    jQuery('#listing-option-page #nav-tabs li a').click(function(){
        var tabnum = jQuery(this).attr('href');
        createCookie('tabnum',tabnum,1);
    });
    var tabnum = readCookie('tabnum');
    if(typeof tabnum != 'undefined' && tabnum!=""){
        $('#listing-option-page #nav-tabs li a[href="'+tabnum+'"]').tab('show');
    }
});

function showHideDashboardForm(catid){
    $('#nav-tabs li').removeClass('active');
    $('#li_'+catid).addClass('active');
    $('.cat_form').hide();
    $('.category_form_'+catid).fadeIn();
    if($("#slabbanner").length > 0){
        if(catid==62){
            $("#slabbanner").hide();
        }else{
            $("#slabbanner").show();
        }
    }
    createCookie('dashboard_tab_select',catid,30);
}

function showCounsellingText(id,title){
    var  text = $('#'+id).html();
    if(typeof title==="undefined" || title==null || title==''){
        title   = 'Counselling Information';
    }
    $('#ActivityLogPopupArea #alertTitle').html(title);
    $('#ActivityLogPopupHTMLSection').addClass('text-left');
    $('#ActivityLogPopupHTMLSection').html(text);
    $('#ActivityLogPopupArea').modal('show');
    return;
}
