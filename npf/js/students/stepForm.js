//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

jQuery(document).on('click',".next",function(){
    if(animating) return false;
    animating = true;

    current_fs = $(this).parent().parent();
    next_fs = $(this).parent().parent().next();

    //activate next step on progressbar using the index of next_fs
    jQuery("#appFeedProgress li").eq($("fieldset").index(next_fs)).addClass("active");

    $('#rating_submit_button').prop('disabled',true);
    //show the next fieldset
    next_fs.show(); 
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
    step: function(now, mx) {
        //as the opacity of current_fs reduces to 0 - stored in "now"
        //1. scale current_fs down to 80%
        scale = 1 - (1 - now) * 0.2;
        //2. bring next_fs from the right(50%)
        left = (now * 50)+"%";
        //3. increase opacity of next_fs to 1 as it moves in
        opacity = 1 - now;
        current_fs.css({
            'transform': 'scale('+scale+')',
            'position': 'absolute'
        });
        next_fs.css({'left': left, 'opacity': opacity});
    }, 
            duration:500, 
    complete: function(){
        current_fs.hide();
        animating = false;
    }, 
    //this comes from the custom easing plugin
    easing: 'easeInOutBack'
    });
});
jQuery(document).on('click',".previous",function(){
    if(animating) return false;
    animating = true;

    current_fs = $(this).parent().parent();
    previous_fs = $(this).parent().parent().prev();

    //de-activate current step on progressbar
    jQuery("#appFeedProgress li").eq($("fieldset").index(current_fs)).removeClass("active");

    $('#rating_submit_button').prop('disabled',true);
    //show the previous fieldset
    previous_fs.show(); 
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
        step: function(now, mx) {
            //as the opacity of current_fs reduces to 0 - stored in "now"
            //1. scale previous_fs from 80% to 100%
            scale = 0.8 + (1 - now) * 0.2;
            //2. take current_fs to the right(50%) - from 0%
            left = ((1-now) * 50)+"%";
            //3. increase opacity of previous_fs to 1 as it moves in
            opacity = 1 - now;
            current_fs.css({'left': left});
            previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
        }, 
        duration:500, 
        complete: function(){
                current_fs.hide();
                animating = false;
        }, 
	//this comes from the custom easing plugin
	easing: 'easeInOutBack'
    });
});

$(document).ready(function(){
  /* 1. Visualizing things on Hover - See next part for action on click */
    $(document).on('mouseover','#stars li', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
   
    // Now highlight all the stars that's not after the current hovered star
    $(this).parent().children('li.star').each(function(e){
        if (e < onStar) {
          $(this).addClass('hover');
        }
        else {
          $(this).removeClass('hover');
        }
    });
    
    }).on('mouseout','#stars li', function(){
        $(this).parent().children('li.star').each(function(e){
        $(this).removeClass('hover');
        });
    });
    
  /* 2. Action to perform on click */
    $(document).on('click','#stars li', function(){
        var onStar = parseInt($(this).data('value'), 10); // The star currently selected
        var stars = $(this).parent().children('li.star');

        for (i = 0; i < stars.length; i++) {
          $(stars[i]).removeClass('selected');
        }

        for (i = 0; i < onStar; i++) {
          $(stars[i]).addClass('selected');
        }

        // JUST RESPONSE 
        var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
        var quid = parseInt($('#stars li.selected').last().data('quid'), 10);
        var maxratingtextbox = parseInt($('#stars li.selected').last().data('maxratingtextbox'), 10);
        var remarkRequired = false;
        var remarkfill     = true;


        var min_rating = parseInt($('#star_min_'+quid).val()-1);
        ratingValue = parseInt(ratingValue)+min_rating;
        
        $('#star_rating_'+quid).val(ratingValue);
        if((typeof maxratingtextbox =='undefined' || maxratingtextbox == 0) || maxratingtextbox>=ratingValue){
            if($('#remark_'+quid).length > 0){
                $('#remark_'+quid).prop('disabled',false).show();
                remarkRequired = true;
            }
        }
        else{
            $('#remark_'+quid).val('').prop('disabled',true).hide();
        }
        
        if(remarkRequired==true){
            if($.trim($('#remark_'+quid).val())==''){
                remarkfill = false;
            }
            else{
                remarkfill = true;
            }
        }
        
        $('#rating_submit_button, #next_button_'+quid).prop('disabled',true);
        if(ratingValue > 0 && remarkfill== true) {
            $('#next_button_'+quid).prop('disabled',false);
            if($('#rating_submit_button').length>0){
                $('#rating_submit_button').prop('disabled',false);
            }
        }
    });
    
    
    $(document).on('keyup','.remark', function(){
        var quid = $(this).data('ramarkid');
        if($.trim($('#remark_'+quid).val())!='' && $('#star_rating_'+quid).val()!=''){
            $('#next_button_'+quid).prop('disabled',false);
            if($('#rating_submit_button').length>0){
                $('#rating_submit_button').prop('disabled',false);
            }
        }
        else{
            $('#next_button_'+quid).prop('disabled',true);
            if($('#rating_submit_button').length>0){
                $('#rating_submit_button').prop('disabled',true);
            }
        }
    });
});