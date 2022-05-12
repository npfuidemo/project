//set variable for window scroll on mobile
var stopScrollFunction = false;

if ($('#faqTaxonomyId').length > 0) { 
    $('#faqTaxonomyId').change(function () {
        submitFAQFilerForm(0);
    });
}

if ($('#faqListFilter #faqTitle').length > 0) {
    //Manage Application Search Field
    $('#faqListFilter #faqTitle').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
        , source: function (request, response) {
            var search = $('#faqListFilter #faqTitle').val();
            if (search)
            {
                $.ajax({
                    url: jsVars.matchingFaqSearchUrl,
                    data: $('#faqListFilter select,#faqListFilter input'),
                    dataType: "json",
                    type: "POST",
                    headers: {
                        "X-CSRF-Token": jsVars._csrfToken
                    },
                    //contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        items = [];
                        map = {};
                        $.each(data.listReports, function (i, item) {
                            //console.log(j);console.log(item2.application_no);
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
        },
        //            $('#FilterForm #search').val(map[item].id);
        //            return item;
        //        }
    });
    
    $('#faqListFilter #faqTitle').change(function() {
        var current = $('#faqListFilter #faqTitle').typeahead("getActive");
        if (current) {
            // Some item from your model is active!
            if (current == $('#faqListFilter #faqTitle').val()) {
                submitFAQFilerForm(0);
                // This means the exact match is found. Use toLowerCase() if you want case insensitive match.
            } else {
                // This means it is only a partial match, you can either add a new item 
                // or take the active if you don't want new items
            }
        } else {
            // Nothing is active so it is a new value (or maybe empty value)
        }
    });
    
    $( "#faqListFilter #faqTitle" ).keyup(function() {
        var faqTitle = $('#faqListFilter #faqTitle').val();
//        console.log(faqTitle.length);
        if (faqTitle.length == 0) {
            submitFAQFilerForm(0);
        }
    });
}

if (parseInt($('div#CollegeFaqListingMobilePage').length) > 0)
{
    $(window).scroll(function() {            
        if(($(this).scrollTop() + $(this).height()) == $(document).height()) 
        {
            if(stopScrollFunction == false)
            {
                submitFAQFilerForm(1);
            }
        }
    });
}

var pageNo = jsVars.pageNo;
function submitFAQFilerForm(loadMore) {
    $('#faq_load_more_button').prop('disabled', true);
    if(loadMore == 0) {
        pageNo = 0;
    }
    
    var showLoadMoreBtn = true;
    //$('#faq_load_more_container').show();
    var filterData = $("form#faqListFilter").serializeArray();
    $.ajax({
        url: jsVars.faqListUrl,
        type: 'post',
        data: {data: filterData, page: pageNo, loadMore:loadMore},
        dataType: 'html',
        headers: {
            "X-CSRF-Token": jsVars._csrfToken
        },
        beforeSend: function () {
            $('div.loader-block').show();
        },
        complete: function () {
            $('div.loader-block').hide();
        },
        success: function (data) {
            if (loadMore == 1) {
                pageNo = pageNo + 1;
            }
            else {
                pageNo = 1;
            }
            if (loadMore == 1) {
                $('.faq_list_container').append(data);
                if ($(data).hasClass( "alert" )) {
                    $('#faq_load_more_container').hide();
                    showLoadMoreBtn =false;
                }
                else if (data == '') {
                    stopScrollFunction = true;
                }
            }
            else {
                if (jsVars.viewType != 'mobile') {
                    active = true;
                    $('.panel-collapse').removeClass('in');
                    $('#collapse-init').text('Expand all');
                    $('.panel-heading').addClass('collapsed');
                    $('.panel-collapse').attr('aria-expanded', 'false');
                    $('.panel-collapse').attr('style', 'height: 0px;');
                    $('#collapse-init').attr('rel', 'expand');
                    $('#accordion').on('show.bs.collapse', function () {
                        if (active) $('#accordion .in').collapse('hide');
                    });
                }
                
                $('.faq_list_container').html(data);
                if ($(data).hasClass( "alert" )) {
                   $('#faq_load_more_container').hide();
                   $('.expand-faq-all').hide();
                   $('#accordion').removeClass('faq-acc-list');
                   showLoadMoreBtn = false;
                }
                else {
                    $('.expand-faq-all').show();
                    $('#accordion').addClass('faq-acc-list');
                }
            }
            
            //For Hide Load More Button
            if($('#totalFaqCount').length && typeof jsVars.ITEM_PER_PAGE !== 'undefined' && jsVars.ITEM_PER_PAGE > 0) {
                if($('#totalFaqCount').val() < jsVars.ITEM_PER_PAGE) {
                    $('#faq_load_more_container').hide();
                    showLoadMoreBtn = false;
                } 
            }
            
            if(showLoadMoreBtn) {
                $('#faq_load_more_container').show();
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            $('div.loader-block').hide();
        }
    });
    $('#faq_load_more_button').prop('disabled', false);
}

function alertPopup(msg, type, location) {
    if (type == 'error') {
        var selector_parent = '#ErrorPopupArea';
        var selector_titleID = '#ErroralertTitle';
        var selector_msg = '#ErrorMsgBody';
        var btn = '#ErrorOkBtn';
        var title_msg = 'Error';
    } else {
        var selector_parent = '#SuccessPopupArea';
        var selector_titleID = '#alertTitle';
        var selector_msg = '#MsgBody';
        var btn = '#OkBtn';
        var title_msg = 'Success';
    }

    $(selector_titleID).html('We Faced some Issue.');
    $(selector_msg).html('Please try again.');
    $('.oktick').hide();

    if (typeof location != 'undefined') {
        $(btn).show();

        $(selector_parent).modal({keyboard: false}).one('click', btn, function (e) {
            e.preventDefault();
            window.location.href = location;
        });
    } else {
        $(selector_parent).modal();
    }
}

$(function () {

    var active = true;

    $('#collapse-init').click(function () {
        
        var rel = $(this).attr('rel');
        
        if (rel == 'expand') {
            active = false;
            $('.panel-collapse').addClass('in');
//            $('.panel-title').attr('data-toggle', '');
            $(this).text('Collapse all');
            $('.panel-heading').removeClass('collapsed');
            $('.panel-collapse').attr('aria-expanded', 'true');
            $('.panel-collapse').removeAttr('style');
            $(this).attr('rel', 'collapse');
        } else {
            active = true;
            $('.panel-collapse').removeClass('in');
            $(this).text('Expand all');
            $('.panel-heading').addClass('collapsed');
            $('.panel-collapse').attr('aria-expanded', 'false');
            $('.panel-collapse').attr('style', 'height: 0px;');
            $(this).attr('rel', 'expand');
        }
    });
    
    $('#accordion').on('show.bs.collapse', function () {
        if (active) $('#accordion .in').collapse('hide');
    });

});


Page = 0;
function LoadFAQData(type) {
        if (type == 'reset') {
            Page = 0;
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
            $('#load_more_button').show();
            $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');  
        }
        var data = $('#FilterLeadForm').serializeArray();
        data.push({name: "page", value: Page});
        data.push({name: "type", value: type});

        $('#load_more_button').attr("disabled", "disabled");
        $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');
        $.ajax({
            url: '/query/ajax-faq-lists',
            type: 'post',
            dataType: 'html',
			async: true,
            //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
			beforeSend: function () {
				$('#listloader').show();
				$('button[name="search-btn"]').prop('disabled', true);
			},
			complete: function () {
				$('#listloader').hide();
				$('button[name="search-btn"]').removeAttr('disabled');
			},
            success: function (data) {
                Page = Page + 1;
                if (data == "session_logout") {
                    window.location.reload(true);
                }
                else if (data == "error") {
                    if(Page==1){
						$('#load_msg_div').show();
						$('#table-data').hide();
						$('#load_msg').html("No Records found");
					}else{
						$('#table-data').show();
						$('#load_msg_div').hide();
						$('#load_more_results_msg').html('<div class="fw-500 text-danger text-center mt-10">No More Record</div>');
					};
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More FAQ');
                    $('#load_more_button').hide();
                      if (type != '' && Page==1) {
                            $('#if_record_exists').hide();
                      }
                }else {
					$('#table-data').show();
					$('#load_msg_div').hide();
                    data = data.replace("<head/>", '');
                    $('#load_more_results').append(data);
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;Load More FAQ');
                   
                    if (type != '') {
                        $('#if_record_exists').fadeIn();
                    }
                    //$.material.init();
                    table_fix_rowcol();
					dropdownMenuPlacement();
					$('.offCanvasModal').modal('hide');
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }