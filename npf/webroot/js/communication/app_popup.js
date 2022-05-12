

function initCKEditor(tokens){
     if(typeof CKEDITOR == 'undefined')
     {
          window.setTimeout(function(){
            initCKEditor(tokens);
        }, 500);
         return;
     }
     
    var newToken = [];
    jQuery.each(tokens, function (index, category) {
        if(category !== ''){
            jQuery.each(category, function (index, value) {
                value = $.parseJSON(value);
                newToken.push(value);
            });
        }
    });
    
    if(typeof tokens =='undefined' || tokens == ''){
        tokens = [["", ""]];
    }
    if(typeof newToken =='undefined' || newToken == ''){
        newToken = [["", ""]];
    }

    var old_data = '';
    if(typeof CKEDITOR.instances['editor'] != 'undefined'){
        var old_data = CKEDITOR.instances['editor'].getData();

        delete CKEDITOR.instances['editor'];
        jQuery('#cke_editor').remove();
    }

    if(typeof fullPageCkEditorHtml != 'undefined' && fullPageCkEditorHtml === true) {
        fullPageCk = true;
        allowedContent = true;
    } else {
        fullPageCk = false;
        allowedContent = false;
    }

    CKEDITOR.replace( 'editor',{
        fullPage: fullPageCk,
        allowedContent: allowedContent,
        extraPlugins: 'token',
        allTokens: tokens,
        availableTokens: tokens,

            tokenStart: '{{',
            tokenEnd: '}}',
            on: {
                instanceReady: function( evt ) {
                    $('div.loader-block').hide();
                }
        }
    });

    if(old_data != ''){
        CKEDITOR.instances['editor'].setData(old_data);
    }
}
