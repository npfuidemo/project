$(function () {
    $('.columnCollasp').each(function (){
        if(!$(this).hasClass('collapsed')){
            var colKeyArr = $(this).attr('id').split('_');
            var colKey = colKeyArr[1];
            console.log(colKey);
            var className = '.collapseSubStage_'+colKey;
            $(className).addClass('hide');
            $('.headerCollapseSubStage_'+colKey).attr('colspan',1);
            $(this).toggleClass('collapsed');
        }
    });
});
function collapseSubColumns(colKey){
	var className = '.collapseSubStage_'+colKey;
	var elementId = '#collapseStage_'+colKey;
    var t = $('.headerCollapseSubStage_'+colKey).attr('data-colspan');
    if($(elementId).hasClass('collapsed')){
        $(className).removeClass('hide');
        $('.headerCollapseSubStage_'+colKey).attr('colspan',t);
    } else {
        $(className).addClass('hide');
        $('.headerCollapseSubStage_'+colKey).attr('colspan',1);
    }
    $(elementId).toggleClass('collapsed');
}