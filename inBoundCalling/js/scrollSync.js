(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
    typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
      (factory((global.$ = global.$ || {}, global.$.fn = global.$.fn || {}), global.$));
}(this, (function(exports, $) {
  'use strict';
  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  function debounce(func, threshold) {
    var timeout;
    return function debounced() {
      var obj = this, args = arguments;
      function delayed() {
        func.apply(obj, args);
        timeout = null;
      }
      timeout && clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold || 100);
    };
  }
  function smartscroll(fn, threshold) {
    return fn ? this.bind('scroll', debounce(fn, threshold)) : this.trigger('smartscroll');
  }
  //jquery-smartscroll
  $.fn.smartscroll = smartscroll;
  function scrollsync(options) {
    var defaluts = {
      x_sync: true,
      y_sync: true,
      use_smartscroll: false,
      smartscroll_delay: 10,
    };
    var options = $.extend({}, defaluts, options);
    //console.log(options);
    var scroll_type = options.use_smartscroll ? 'smartscroll' : 'scroll';
    var $containers = this;
    var scrolling = {};
    Object.defineProperty(scrolling, 'top', {
      set: function(val) {
        $containers.each(function() {
          $(this).scrollTop(val);
        });
      }
    });
    Object.defineProperty(scrolling, 'left', {
      set: function(val) {
        $containers.each(function() {
          $(this).scrollLeft(val);
        });
      }
    });

    $containers.on({
      mouseover: function() {
        if (scroll_type == 'smartscroll') {
          $(this).smartscroll(function() {
            options.x_sync && (scrolling.top = $(this).scrollTop());
            options.y_sync && (scrolling.left = $(this).scrollLeft());
          }, options.smartscroll_delay);
          return;
        }
        $(this).bind('scroll', function() {
          options.x_sync && (scrolling.top = $(this).scrollTop());
          options.y_sync && (scrolling.left = $(this).scrollLeft());
        });
      },
      mouseout: function() {
        $(this).unbind('scroll');
      }
    });
    return this;
  }

  exports.scrollsync = scrollsync;
  Object.defineProperty(exports, '__esModule', { value: true });
})));
//end scroll sync min
//table head fixed on scroll
function theadSticky() {
  if($(window).width() > 767) {
    if($(".tableFixed").length > 0) {
      $(".tableFixed").html("");
      $('.table-duplicate').remove();
    }
    var $header, $fixedHeader
    $('.theadsync-sticky').each(function(index){ 
      if(index == 0) {
        index = ''
      }
      var element = $(this);
      $( '<div class="table-duplicate syncContainer'+index+'"><table class="table tableFixColumn tableFixed" ></table></div>').insertBefore(element);
      tabHeadHeight = $(this).find('.table thead').outerHeight()
      element.css("margin-top", -tabHeadHeight)
      $header = $(this).find(".table > thead").clone();
      $fixedHeader = $(this).prev('.table-duplicate').find(".tableFixed").append($header);
      
      $(this).find(".table thead tr th").each(function() {
        var index = $(this).index();            
        $(this).parents('.theadsync-sticky').prev('.table-duplicate').find(".tableFixed thead tr th").filter(":nth-child(" + (index + 1) + ")").css("min-width", $(this).outerWidth()).css("min-height", $(this).outerHeight());
      });
      $('.syncContainer'+index+'').scrollsync();
    })
      
    
    // Table Check box related code if need you can use it with your related attr
    if($('#selected_records_on_page').length > 0) {
      setTimeout(function() {
        $('.table-duplicate #selected_records_on_page').remove()
        $('<input type="checkbox" name="selectAllDuplicate" class="selectAllDuplicate">').insertBefore($('.table-duplicate label[for="selected_records_on_page"]'));
      }, 100);
    }

    $('.table-duplicate').on('click', ".selectAllDuplicate", function(){
      $('#selected_records_on_page').trigger("click")
    })

    var tableRowLength = $('.theadsync-sticky tbody tr').length;
    if(tableRowLength > 4) {
      $('.actionbtn').parent('.btn-group').attr("data-container", ".section-body");
    }
    else {
      $('.actionbtn').parent('.btn-group').attr("data-container", "body")
    }

    }
}
