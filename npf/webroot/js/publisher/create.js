$(document).ready(function(){
    
    $('.traffic_channel').SumoSelect({placeholder: 'Select Channel', search: true, searchText:'search', captionFormatAllSelected: "All Selected.", triggerChangeCombined: false });

    $("#submitbutton").on("click",function(){
        var isError = false;
        $("#name_error").html("");
        $("#website_error").html("");
        $("#college_id_error").html("");
        $("#traffic_channel_error").html("");
        if($('select[name="traffic_channel[]"').val() == null){
            $("#traffic_channel_error").html("Please select atleast one traffic channel.");
            isError = true;
        }
        if($.trim($("#name").val())==''){
            $("#name_error").html("Please enter publisher name.");
            isError = true;
        }
        if($.trim($("#website").val())=='' || $.trim($("#website").val())=='www.'){
            $("#website_error").html("Please enter publisher website.");
            isError = true;
        }
        if(isError){
            return false;
        }
        $('#traffic-channel')[0].sumo.enable();
        $('#listloader').show();
        $("#createPublisher").submit();

    });
    
    if($('input[type="file"]').length > 0){
        customFile();
    }
                          
});

last_valid_selection = $('#traffic-channel').val();
$('#traffic-channel').on('change', function (evt) {
    var currentValue = $('#traffic-channel').val();
    if ( currentValue != null && (currentValue.length > 2 || (currentValue.length>1 && !currentValue.includes('9')))) {
        alert('Max 2 selections allowed including OFFLINE traffic channel');
        var $this = $(this);
        var optionsToSelect = last_valid_selection;
        $this[0].sumo.unSelectAll();
        $.each(optionsToSelect, function (i, e) {
            $this[0].sumo.selectItem($this.find('option[value="' + e + '"]').index());
        });
        last_valid_selection = optionsToSelect;
    } else if ($('#traffic-channel').val() != null) {
        last_valid_selection = $(this).val();
    }
});

$('html').on('click','#source_tags',function(e){
   var editCase = $('#id').val();
    if(editCase !=""){
        var currentTrafficChannel = $('#traffic-channel').val(); 
        currentTrafficChannel = currentTrafficChannel.join();
        var oldTrafficChannel = $('input[name="Oldtraffic_channel"]').val(); 
        if(currentTrafficChannel != oldTrafficChannel){
            e.preventDefault();
            $('#source_tags').attr('readonly',true);
            alert('Please first save your previous changes.');
        } else {
            $('#source_tags').attr('readonly',false);
        }
    }
});

$('html').on('keyup','#source_tags',function(e){
   var editCase = $('#id').val();
    if(editCase !=""){
        var source_tags = $('#source_tags').val(); 
        var old_source_tags = $('input[name="Oldsource_tags"]').val(); 
        if(source_tags != old_source_tags){
            $('#traffic-channel')[0].sumo.disable();
        } else {
           $('#traffic-channel')[0].sumo.enable(); 
        }
    }
});

$('#traffic-channel').on('click',function(){
    var disabled = $(this).attr('disabled');
    if (typeof disabled !== typeof undefined && disabled == 'disabled') {
        alert('Please first save your previous changes.');
    }
});

function removePublisherLogo(Obj, prevElement, publisherId)
{
    if (publisherId)
    {
        $.ajax({
            url: '/publishers/remove-publisher-logo',
            type: 'post',
            data: {publisherId: publisherId},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('body div.loader-block').show();
            },
            complete: function () {
                $('body div.loader-block').hide();
            },
            success: function (json) {

                if (json['redirect'])
                {
                    location = json['redirect'];
                }
                else if (json['error'])
                {
                    alertPopup(json['error'], 'error');
                }
                else if (json['success'] == 200)
                {
                    $('#SuccessPopupArea p#MsgBody').text('Publisher logo removed.');
                    $('a#SuccessLink').trigger('click');
                    var parentDiv = $(Obj).parent("div#RemoveBtnParentDiv");
					$(parentDiv).find(".fileBrowseCustom ").removeClass('notEmpty');
					$(parentDiv).find(".input-group").css('display', 'table');
                    $(parentDiv).find(".input_file").css('display', 'block');
                    $(parentDiv).find("input").prop('disabled', false);
                    $(Obj).remove();
                    $(parentDiv).find(prevElement).remove();
                    $("#imgDiv").hide();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('body div.loader-block').hide();
            }
        });
    }
    else
    {

    }
}