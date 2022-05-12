$(document).ready(function () {
    $('.executeLogic').on('change',function(){
        excecuteLogic();
    });
    excecuteLogic();
});


function excecuteLogic(id){
    if(typeof id =='undefined'){
        id='';
    }    
    
    var panelType = 'single';
    if($('.gdMatrix').length > 0){
        panelType = 'group';
    }
    var data=$("form#createScorePunch").serializeArray();
    data.push({name:'formId', value:jsVars.form_id});
    data.push({name:'panel_id', value:jsVars.panel_id});
    data.push({name:'collegeId', value:jsVars.college_id});
    data.push({name:'panelType', value:panelType});
    if(id!=''){
        data.push({name:'app_no',value:id});
    }
   $.ajax({
        url: jsVars.FULL_URL+'/score-card/excecuteLogic',
        type: 'post',
        dataType: 'json',
        data:data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
                
            },
        complete: function () {
                
            },
        success: function (data) {
            if (data['message'] == "session") {
                window.location.reload(true);
            }else if(data['message'] == "invaid_req"){
               window.location.replace(jsVars.FULL_URL+'/post-applications/'); 
            }else if (data['status'] == 0) {
                for (var i in data['data']) {
                    $(".error_" + i).text(data['data'][i]);
                }                
            } else if (data['status'] == 200) {
                var id='';
                if(panelType=='single'){
                    if(typeof data['data']['mandatory_fields'] != "undefined"){
                    var mandatory_fields= data['data']['mandatory_fields'];
                    } 
                    if(typeof data['data']['show_hide_fields']['show_fields'] != 'undefined'){
                    var show_fields= data['data']['show_hide_fields']['show_fields'];
                    }
                    if (typeof data['data']['show_hide_fields']['hide_fields'] != 'undefined'){
                    var hide_fields= data['data']['show_hide_fields']['hide_fields'];
                    }
                    if(typeof mandatory_fields !="undefined"){
                    $.each(mandatory_fields,function(key,val){
                        var id='';
                        var keyArr=key.split('_');                    
                        for(i in keyArr){
                            id += camelize(keyArr[i]);
                        }
                        if(val==true){
                            var placeholder = $("#"+id).attr('placeholder');         
                            if($("#" + id).parent().parent().find('.control-label').find('.required').length<=0){
                                $("#"+id).attr('placeholder',placeholder+' *');
                                $("#"+id).parent().parent().find('.control-label').append('<span class="required">*</span>');
                            }
                        }else{
                            var placeholder = $("#"+id).attr('placeholder');
                            if(typeof placeholder !='undefined'){
                            placeholder = placeholder.replace('*','');
                           }
                            $("#"+id).attr('placeholder',placeholder);
                            $("#"+id).parent().parent().find('.control-label').find('.required').remove();
                        }
                    });
                    }
                    if(typeof show_fields != "undefined"){
                    $.each(show_fields,function(key,val){
                        var id='';
                        var keyArr=key.split('_');                    
                        for(i in keyArr){
                            id += camelize(keyArr[i]);
                        }
                        var type = $("#"+id).attr("type");
                        if(val==true){
                            if(type=='text'){
                                $("#"+id).parent().parent().css('display','block');
                            }else{
                                $("#"+id).parent().css('display','block');
                            }
                            //$("#"+id).closest('.form-group').css('display','block');
                            $("#"+id).closest('.form-group').css('display','block');
                        }else{
                            if(type=='text'){
                                $("#"+id).parent().parent().css('display','none');
                            }else{
                                $("#"+id).parent().css('display','none');
                            }
                            //$("#"+id).closest('.form-group').css('display','none');
                            $("#"+id).closest('.form-group').css('display','none');
                        }
                    });
                }
                if(typeof hide_fields != "undefined"){
                    $.each(hide_fields,function(key,val){
                        var id='';
                        //console.log(key);
                        var keyArr=key.split('_');
                        for(i in keyArr){
                            id += camelize(keyArr[i]);
                        }
                        var type = $("#"+id).attr("type");
                        if(val===true){
                            if(type=='text'){
                                 $("#"+id).parent().parent().css('display','none');   
                            }else{
                                 $("#"+id).parent().css('display','none');
                            }
                            //$("#"+id).closest('.form-group').css('display','none');
                            $("#"+id).closest('.form-group').css('display','none');
                        }else{
                            if(type=='text'){
                                $("#"+id).parent().parent().css('display','block');
                            }else{
                                $("#"+id).parent().css('display','block');
                            }
                            //$("#"+id).closest('.form-group').css('display','block');
                            $("#"+id).closest('.form-group').css('display','block');
                        }
                    });
                }
                }else if(panelType=='group'){   
                    $.each(data['data'],function(key,AllFields){
                        if(typeof AllFields['mandatory_fields'] != "undefined"){
                        var mandatory_fields= AllFields['mandatory_fields'];
                        }
                       if(typeof AllFields['show_hide_fields']['show_fields'] != "undefined"){
                        var show_fields= AllFields['show_hide_fields']['show_fields'];
                         }
                       if(typeof AllFields['show_hide_fields']['hide_fields'] != "undefined"){
                        var hide_fields= AllFields['show_hide_fields']['hide_fields'];
                         }
                        if(typeof mandatory_fields !='undefined'){
                            $.each(mandatory_fields,function(mkey,mval){
                                var id='';
                                var keyArr=mkey.split('_');         
                                for(i in keyArr){
                                    id += camelize(keyArr[i]);  
                                }
                                var mclass = id;
                                if(mval==true){
                                    var parentDiv = $("form#createScorePunch #"+ key +" ." +mclass).parents('div.form-group');
                                    var placeholder = $(parentDiv).find('input').attr('placeholder');
                                    placeholder = placeholder.replace('*','').trim();
                                    $(parentDiv).find('input').attr('placeholder',placeholder+' *');
                                    //alert('.Head'+mclass);
                                    $('.Head'+mclass).find('.required').remove();
                                    $('.Head'+mclass).append('<span class="required">*</span>');
                                }else{
                                    var parentDiv = $("form#createScorePunch #"+ key +" ." +mclass).parents('div.form-group');
                                    var placeholder = $(parentDiv).find('input').attr('placeholder');
                                    if(typeof placeholder !='undefined'){
                                    placeholder = placeholder.replace('*','');
                                  }
                                    $(parentDiv).find('input').attr('placeholder',placeholder);
                                    $('.Head'+mclass).find('.required').remove();
                                }
                            });
                        }
                        
                        if(typeof show_fields !='undefined'){
                            $.each(show_fields,function(skey,sval){
                                var id='';
                                var keyArr=skey.split('_');         
                                for(i in keyArr){
                                    id += camelize(keyArr[i]);  
                                }
                                //alert(id);
                                var mclass = id;
                                var parentDiv = $("form#createScorePunch #"+ key +" ." +mclass).parents('div.form-group');
                                //alert(parentDiv);
                                if(sval==true){
                                    $(parentDiv).css('display','block');
                                }else{
                                    $(parentDiv).css('display','none');
                                }
                            });
                        }
                        if(typeof hide_fields !='undefined'){
                            $.each(hide_fields,function(hkey,hval){
                                var id='';
                                //console.log(key);
                                var keyArr=hkey.split('_');                    
                                for(i in keyArr){
                                    id += camelize(keyArr[i]);
                                }
                                var parentDiv = $("form#createScorePunch #"+ key +" ." +id).parents('div.form-group');
                                if(hval===true){
                                    $(parentDiv).css('display','none');
                                }else{
                                    $(parentDiv).css('display','block');
                                }
                            });
                        }
                    });
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    }); 
}

function camelize(text) {
    return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
}


$('#scoreCalculateBtn').on('click', function(){
    if(typeof id =='undefined'){
        id='';
    }    
    
    var panelType = 'single';
    if($('.gdMatrix').length>0){
        panelType = 'group';
    }
    var data=$("form#createScorePunch").serializeArray();
    data.push({name:'formId', value:jsVars.form_id});
    data.push({name:'panel_id', value:jsVars.panel_id});
    data.push({name:'collegeId', value:jsVars.college_id});
    data.push({name:'panelType', value:panelType});
    if(id!=''){
        data.push({name:'app_no',value:id});
    }
    
    $.ajax({
        url: jsVars.FULL_URL+'/score-card/excecuteCalculatorLogic',
        type: 'post',
        dataType: 'json',
        data:data,
        headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
        beforeSend: function () {
                
            },
        complete: function () {
                
            },
        success: function (data) {
            if (data['message'] == "session") {
                window.location.reload(true);
            }else if(data['message'] == "invaid_req"){
                window.location.reload(true);
            }else if (data['status'] == 0) {
               
            } else if (data['status'] == 200) {
                var id='';
                if(panelType=='single'){
                    var mandatory_fields= data['data'];
                    $.each(mandatory_fields,function(key,val){
                        var id='';
                        var keyArr=key.split('_');        
                        for(i in keyArr){
                            id += camelize(keyArr[i]);
                        }
                        $("#"+id).val(val);
                    });
                }else if(panelType=='group'){
                    var mandatory_fields= data['data'];
                    $.each(mandatory_fields,function(key,AllFields){
                        $.each(AllFields,function(mkey,mval){
                            id='';
                            var keyArr=mkey.split('_');        
                            for(i in keyArr){
                                id += camelize(keyArr[i]);
                            }
                            var mclass = id;
                            var parentDiv = $("form#createScorePunch #"+ key +" ." +mclass).parents('div.form-group');
                            parentDiv.find('input').val(mval);
                        });
                    });
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    }); 
    
});