/* 
 * To handle ckeditor function.
 */

//remove CK Editor
function removeCKEditor(id)
{
    if(typeof id =='undefined' || id == ''){
        id = '';
    }
    
    if(id != '')
    {    
        var old_data = '';
        if(typeof CKEDITOR.instances[id] != 'undefined'){ 
            old_data = CKEDITOR.instances[id].getData();
            delete CKEDITOR.instances[id];
            $('#'+id).val(old_data);
            $('#cke_'+id).remove();
        }           
    }
}

//create CK Editor
function initMultipleCKEditor(id, token=[]){ 
    
    if(typeof id =='undefined' || id == ''){
        id = '';
    }
    
    if(id != '')
    {    
        var old_data = '';
        if(typeof CKEDITOR.instances[id] != 'undefined'){
            var old_data = CKEDITOR.instances[id].getData();
            delete CKEDITOR.instances[id];
            $('#cke_'+id).remove();
        }    
        
        CKEDITOR.replace( id,{
            extraPlugins: 'token,justify',    
            availableTokens: token,
            tokenStart: '{{',
            tokenEnd: '}}',
                on: {
                    instanceReady: function( evt ) {
                        $('div.loader-block').hide();
                    }
            }
        });

        if(old_data != ''){
            CKEDITOR.instances[id].setData(old_data);
        }
    }
}

