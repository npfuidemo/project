function searchDependentField() {
  if($('.dependencyChoices').length > 0){
      $(".searchDependency").on('keyup', function(){
        var value = $(this).val().toLowerCase();
        var thisEachParent = $(this).parent().siblings('.selectDependency').find('li');
        thisEachParent.each(function () {
            if ($(this).text().toLowerCase().search(value) > -1) {
              $(this).show();
            } else {
              $(this).hide();
            }
        });
          if($(this).parent().siblings('.selectDependency').children(':visible').length == 0) {
              $(this).parent().siblings('.noDataSearch').show();
          }else{
              $(this).parent().siblings('.noDataSearch').hide();
          }
      })
  }
}

function onselectParentOption(obj){
  var categoryId = $(obj).attr('id').split('_')[1];
  $('.dependentfiled').hide();
  $('#contentBlk_'+categoryId).show();
  $(obj).siblings().removeClass('active')
  $(obj).addClass('active');
  defaultfunc();
}
function defaultfunc(){
  $(".dependentfiled").each(function(){
    $('.dependentfiled').find('input[type="checkbox"]').on('click', function(){
      mainCatId = $(this).closest("[id^=contentBlk_]").attr('id').split('_')[1];
      if($('#contentBlk_' + mainCatId).find("input[type='checkbox']:checked").length > 0) {
        $("#blk_"+mainCatId).addClass('activeIcon');
      }
      else {
        $("#blk_"+mainCatId).removeClass('activeIcon');
      }
    })
  })
}
defaultfunc();