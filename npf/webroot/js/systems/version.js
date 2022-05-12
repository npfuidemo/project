function LoadVersionData(type) {
    var data = [];
    if (type == 'reset') {
        Page = 1;
        $('#load_more_results_version').html("");
        $('#load_more_button').show();
        $('#load_more_button').html("Loading...");
        $('#versionDiv .text-danger').remove();
    }
    data = $('#FilterVersionForm').serializeArray();
    data.push({name: "page", value: Page});

    $('#load_more_button').attr("disabled", "disabled");
    $('#load_more_button').html('<i class="fa fa-refresh fa-spin" aria-hidden="true"></i>&nbsp;Loading...');

    $.ajax({
        url: jsVars.FULL_URL + '/systems/version-ajax-lists',
        type: 'post',
        dataType: 'html',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
	beforeSend: function () { 
            $('.loader-block').show();
        },
        complete: function () {
            $('.loader-block').hide();
        },
        success: function (data) {
            Page = Page + 1;
            if (data == "session_logout" || data == "invalidcsrf") {
                window.location.reload(true);
            } else if (data == "norecord") {
                if (Page == 1)
                    error_html = "No Records found";
                else
                    error_html = "No More Record";
                $('#versionDiv').append("<div class='text-center text-danger margin-top-10'>" + error_html + "</div>");
                $('.text-danger + .text-danger').hide();
                $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Record');
                $('#load_more_button').hide();
            } else {
                data = data.replace("<head/>", '');
                $('#load_more_results_version').append(data);
                dropdownMenuPlacement();
                if((data.match(/<tr>/g) || []).length < 10) {
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Record');
                    $('#load_more_button').hide();
                } else {
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html('<i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Load More Record');
                }
                $('.offCanvasModal').modal('hide');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

// dropdownMenuPlacement with body
function dropdownMenuPlacement(){
	// hold onto the drop down menu
    var dropdownMenu;
    // and when you show it, move it to the body
    $('.ellipsis-left').on('show.bs.dropdown', function (e) {

                        // grab the menu
                        dropdownMenu = $(e.target).find('.dropdown-menu');
                        dropHeight = dropdownMenu.outerHeight() - 50;

                        // detach it and append it to the body
                        $('body').append(dropdownMenu.detach());

                        // grab the new offset position
                        var eOffset = $(e.target).offset();
						var offsetDropPos = eOffset.top - dropHeight;
                        // make sure to place it where it would normally go (this could be improved)
                        dropdownMenu.css({
                                'display': 'block',
                                //'top': eOffset.top + $(e.target).outerHeight(),
                                'top': (offsetDropPos < 0) ? 0 : offsetDropPos,
                                'left': eOffset.left - 135
                        });
    });
    // and when you hide it, reattach the drop down, and hide it normally
        $('.ellipsis-left').on('hide.bs.dropdown', function (e) {
            $(e.target).append(dropdownMenu.detach());
                dropdownMenu.hide();
        });
}

function filterResetModal() {
    if ($('.offCanvasModal .chosen-select').length > 0) {
        $('.offCanvasModal .chosen-select').each(function () {
            this.selected = false;
            $(this).val('');
            $(this).trigger("chosen:updated");
        });
    }
}

function showMessage(text, id) {
    $('#abc'+id).popover({
        container: 'body',
        html: true,
        trigger: 'hover',
        title: 'Message',
        placement: 'right',
        content: text
    });
    $('#abc'+id).popover('show');
}