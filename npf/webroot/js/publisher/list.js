$(document).ready(function(){
    LoadReportDateRangepicker();
    loadMorePublishers('reset');
    // show calander
//    if ($('#created_date').length > 0) {
////        $('#created_date').datepicker({startView: 'month', format: 'd M yyyy', enableYearToMonth: true, enableMonthToDay: true}).
////                on('changeDate', function () {});
//        $('#created_date').datetimepicker({format: 'DD/MM/YYYY'});
//    }
    // code for search box starts
    if ($('#filterPublisherForm #search').length > 0) {
        $('#filterPublisherForm #search').typeahead({
            hint: true,
            highlight: true,
            minLength: 1,
            source: function (request, response) {
                var search = $('#filterPublisherForm #search').val();
                if (search)
                {
                    $.ajax({
                        url: jsVars.searchPublisherLink,
                        data: {search: search},
                        dataType: "json",
                        type: "POST",
                        headers: {
                            "X-CSRF-Token": jsVars._csrfToken
                        },
                        success: function (data) {
                            items = [];
                            map = {};
                            $.each(data.listPublishers, function (i, item) {
                                var name = item;
                                map[name] = {name: name};
                                items.push(name);
                            });
                            response(items);
                            $(".dropdown-menu").css("height", "auto");
                        },
                        error: function (response) {
                            alertPopup(response.responseText);
                        },
                        failure: function (response) {
                            alertPopup(response.responseText);
                        }
                    });
                }
            }
        });
    }
    // code for search box ends
    
    $('.searchPublisher').keypress(function (e) {
        var key = e.which;
        if(key === 13)  // the enter key code
        {
            loadMorePublisher('reset');
        }
    });
    $('.daterangepicker').addClass('couponListDateRange');
});

function loadMorePublishers(listingType){
    
    if(listingType === 'reset'){
        $("#page").val(1);
        $("#lastSearched").val($("#search").val());
    }
    
    $.ajax({
        url: jsVars.loadMorePublisherLink,
        type: 'post',
        data: $('#publisherSearchArea input,#publisherSearchArea select'),
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars.csrfToken
        },
        beforeSend: function () { 
            $('#publisherListLoader').show();
        },
        complete: function () {
            $('#publisherListLoader').hide();
        },
        success: function (html) {
            var checkError  = html.substring(0, 6);
            if (html === 'session'){
                location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
            }else if (checkError === 'ERROR:'){
                alert(html.substring(6, html.length));
                $('#loadMorePublisherArea').hide();
            }else{
                var countRecord = countResult(html);
                html    = html.replace("<head/>", "");
                if(listingType === 'reset'){
                    $('#load_more_results_publisher').html(html);
                }else{
                    $('#load_more_results_publisher tbody').append(html);
                }
                if(countRecord < 10){
                    $('#loadMorePublisherArea').hide();
                }else{
                    $('#loadMorePublisherArea').show();
                }
				$('.offCanvasModal').modal('hide');
				dropdownMenuPlacement();
                $("#page").val(parseInt($("#page").val())+1);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
};

function countResult(html){
    var len = (html.match(/listDataRow/g) || []).length;
    return len;
}


function exportPublisherCSV(){
    var $form = $("#filterPublisherForm");
    $form.attr("action",jsVars.exportPublisherCsvLink);
    $form.attr("target",'modalIframe');
    var onsubmit_attr = $form.attr("onsubmit");
    $form.removeAttr("onsubmit");
    $('#myModal').modal('show');
    $form.submit();
    $form.attr("onsubmit",onsubmit_attr);
    $form.removeAttr("target");
};

var downloadPublisherFile = function(url){
    window.open(url, "_self");
};

function ChangePublisherStatus(publisherId){
    
    if ($.trim(publisherId) > 0)
    {
        var currentStatus = $("#"+publisherId).find("#publisherStatusSpan").attr('alt');
        $.ajax({
            url: jsVars.ChangePublisherStatusLink,
            type: 'post',
            data: {publisherId: publisherId,  currentStatus: currentStatus},
            dataType: 'json',
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            beforeSend: function () {
                $('#publisherListLoader').show();
            },
            complete: function () {
                $('#publisherListLoader').hide();
				
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
                    if (json['changes'])
                    {                        
                        $('#' + publisherId).find("#publisherStatusSpan").attr('alt',json['changes']['status']);
                        //$('#' + publisherId).find("#publisherStatusSpan").text(json['changes']['statusFlagText']);
                        $('#' + publisherId).find("#publisherStatusSpan").removeClass(json['changes']['removeClass']);
                        $('#' + publisherId).find("#publisherStatusSpan").addClass(json['changes']['statusClass']); 
                        $('#' + publisherId).find("#publisherChangeStatus").html(json['changes']['statusChangeText']); 
						
						
						if(json['changes']['status']=='Disable'){
							$('#' + publisherId).find("#publisherStatusSpan").removeClass('dataEnable payment-not-recieve-message').addClass('dataDisable');
						}else{
							$('#' + publisherId).find("#publisherStatusSpan").removeClass('dataDisable payment-recieve-message').addClass('dataEnable');
						}
					} 

                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                $('div.loader-block').hide();
            }
        });
    }
    else
    {
        alertPopup('Getting error in process. Please refresh the page and try again.', 'error');
    }
}

function displayAssignedUser(publisher_id){
    var html = $('#assigned_user_'+publisher_id).html();
    //alertPopup(html, "success");
    //$('#alertTitle').html('Assigned user List');
	$('#pid'+publisher_id).popover({
		container: 'body',
		html: true,
		trigger: 'focus',
		title: 'Assigned user List ',
		placement: 'right',
		content: html,
	});
	$('#pid'+publisher_id).popover('show');
}
