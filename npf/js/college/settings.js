$(document).ready(function(){
    $("#detailReportLoader").hide();
    $('#standardScoreConfigForm').find('span,label').css({'font-size':'14px'});
    $('#extendedScoreConfigForm').find('span,label').css({'font-size':'14px'});
    $('#addExtendedScoreConfigForm').find('span,label').css({'font-size':'14px'});
    $(".select-extended-check").click(function(){
        var row = $(this).parent().parent();
        if(this.checked){
            row.find('select').attr('disabled', false).trigger("chosen:updated");
            row.find('input[type="radio"]').attr('disabled', false);
            row.find('label,span').css("color",'#333');
        }else{
            row.find('select').attr('disabled', true).trigger("chosen:updated");
            row.find('label,span').css("color",'#BDBDBC');
            row.find('input[type="radio"]').attr('disabled', true);
        }
        
    });
    $("#score_10085, #score_10086").change(function(){
        var score   = parseFloat($("#score_10085").val()) + parseFloat($("#score_10086").val());
        if(score > 10 ){
            score   = 10;
        }
        if(score < -10 ){
            score   = -10;
        }
        $("#score_10043").val(score).trigger("chosen:updated");
    });
    
    if( typeof jsVars.scrollToExtended !== 'undefined' && $("#extendedTbody").length > 0 && $("#extendedTbody").length > 0){
        $('html, body').animate({
            scrollTop: $("#extendedScoreConfigForm").offset().top
        }, 1000);
    }
});

function editStandardScoreConfig(){
    $("#standardScoreConfigForm").find('select').attr('disabled', false).trigger("chosen:updated");
    $("#standardScoreConfigForm").find('input').attr('disabled', false);
    $("#standardScoreConfigForm").find('label,span').css("color",'#333');
    $("#saveStandardScoreConfigButton").show();
    $("#editStandardScoreConfigButton").hide();
}

function editExtendedScoreConfig(){
    $("#extendedScoreConfigForm").find('select').attr('disabled', false).trigger("chosen:updated");
    $("#extendedScoreConfigForm").find('input').attr('disabled', false);
    $("#extendedScoreConfigForm").find('label,span').css("color",'#333');
    $("#saveExtendedScoreConfigButton").show();
    $("#editExtendedScoreConfigButton").hide();
}

function saveStandardScoreConfig(){
    $("#detailReportLoader").show();
    $("#standardScoreConfigForm").submit();
}

function saveExtendedScoreConfig(){
    $("#detailReportLoader").show();
    $("#extendedScoreConfigForm").submit();
}

function addExtendedScoreConfig(){
    $('#addExtendedModal').modal('hide');
    $("#detailReportLoader").show();
    $("#addExtendedScoreConfigForm").submit();
}

function deleteExtendedScoreConfig(link){
    $("#deleteExtendedScoreConfigLink").attr('href', link);
    $('#removeExtendedConfirmationModal').modal('show');
}

function addExtendedScoreConfigOld(){
    $(".select-extended-check").each(function(){
        var activityCode    = $(this).val();
        if(this.checked){
            if($("#extended_row_"+activityCode).length==0){
                $("#extendedDiv").show();
                var activityName    = $('#extended_activity_name_'+activityCode).html();
                var activityScore   = $('#extended_score_'+activityCode).val();
                var freqEveryTime   = $('#extended_everytime_'+activityCode).val()=='1'?'checked':'';
                var freqOneTime     = $('#extended_onetime_'+activityCode).val()=='1'?'checked':'';
                $("#extendedTbody").append('<tr class="listDataRow" id="extended_row_'+activityCode+'"><td>'+activityName+'<input type="hidden" name="extended_activity_code[]" value="'+activityCode+'"></td><td><input type="number" name="extended_score[]" value="'+activityScore+'"></td><td><input type="checkbox" name="extended_everytime[]" class="checkbox-cust " value="0" '+freqEveryTime+'>&nbsp;&nbsp; Every time &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" name="extended_onetime[]" class="checkbox-cust " value="1" '+freqOneTime+'>&nbsp;&nbsp; First time only &nbsp;&nbsp;&nbsp;&nbsp;</td></tr>');
                
            }
        }else{
            if($("#extended_row_"+activityCode).length==1){
                $("#extended_row_"+activityCode).remove();
            }
        }
    })
    $('#addExtendedModal').modal('hide');
}
