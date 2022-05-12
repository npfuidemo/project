/*For Load More Redis Data using Ajax*/
function LoadMoreRedis(type) {
        if (type == 'reset') {
            Page = 0;
            $('input[name="search_btn"]').val('Apply').attr('disabled','disabled');
            $('#load_more_results').html("");
            $('#load_more_results_msg').html("");
            $('#load_more_results_msg').show("");
            $('#load_more_button').show();
            $('#adv_column').val("");
            $('#adv_value').val("");
            $('#load_slider_data').html("");
            $('#load_more_button').html('<i class="fa fa-refresh fa-spin"></i>&nbsp;Loading...');
            $('#view_by').val('');
        }
        var data = $('#SearchKeyForm').serializeArray();        
        data.push({name: "page", value: Page});   
        
        $('#load_more_button').html('<i class="fa fa-refresh fa-spin"></i>&nbsp;Loading...').attr("disabled", "disabled"); 
        $.ajax({
            url: '/redis/ajax-load-redis-data',
            type: 'post',
            dataType: 'html',            
            data: data,
            headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
            success: function (data) { 
                console.log(data);
                $('.offCanvasModal').modal('hide');
                $('.table-responsive').addClass('newTableStyle');

                if (type == 'reset') {
                    $('input[name="search_btn"]').val('Apply').removeAttr('disabled');
                }
                Page = Page + 1;
                if(data == 'session_logout'){
                    location = '/';
                }else if (data == "blank_error") {
                    $('#load_more_results_msg').append("<div class='alert alert-danger'>Please select bucket.</div>");
                    $('#load_more_button').hide();
                }else if(data=='auth_error'){
                    window.location.href= '/redis/manage-keys';
                }else if (data == "error") {

                    if(Page==1){
                        error_html="No data found with selected filters";
                        $('#load_more_results').append("<div class='noDataFoundDiv'><div class='innerHtml'><img src='/img/no-record.png' alt='no-record'><span style='font-size:14px;'>"+error_html+"</span></div></div>");
                        $('.table-responsive').removeClass('newTableStyle');
                        error_html="No Records found";
                        $('#delBtn, #tot_records').html('');                        
                        $('#tot_rec').val('');
                    }else{
                        error_html="No More Record";
                    }
                    $('#load_more_results_msg').append("<div class='alert alert-danger'>"+error_html+"</div>");
                    $('#load_more_button').html("Load More Data");
                    $('#load_more_button').hide();
                }else {
                    data = data.replace("<head/>", '');
                    //console.log(data);
                    $('#load_more_results').append(data);
                    $('#load_more_button').removeAttr("disabled");
                    $('#load_more_button').html('<i class="fa fa-refresh"></i>&nbsp;Load More Data');  
                    
                    if(Page==1){
                    $('#delBtn').html('<button type="button" class="btn radius-20 btn-danger" onclick="deleteKey()" name="delete"><i class="fa fa-trash" aria-hidden="true"></i>&nbsp; Delete Selected</button>');
                    }
                }                
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
        
        return false;
    }
    
/*For Check All*/
function redisSelectAll(elem,class_name){    
    if($.trim(class_name)!=''){
        if(elem.checked){            
            $('.'+class_name).each(function(){
                this.checked = true;
            });
        }else{
            $('.'+class_name).attr('checked',false);
        }        
    }
}

/*For Delete Key*/
function deleteKey(){
    var tot_sel=0;
    var all_checked_val = [];
    //Initially blank all tr's chkbox_selected_key class to blank    
    $('tr').removeClass('chkbox_selected_key');
    $('.select_key').each(function(){
        if(this.checked){
            //Set this class on all selected tr so after successful delete of the key it will remove that tr
            $(this).closest('tr').addClass('chkbox_selected_key');             
            all_checked_val.push($(this).val());
            tot_sel++;
        }
    });
    var all_selected='';
    if($('input[name="delete_all"]').is(':checked')){
        all_selected=1;        
    }    
    if(tot_sel>0){        
        $('#ConfirmMsgBody').html('Are you sure to delete the selected data?');
        $('#ConfirmPopupArea').modal({backdrop: 'static', keyboard: false})
            .one('click', '#confirmYes', function (e) {
            e.preventDefault();            
            var act = '';
            var data={bucket:$('select[name="bucket"]').val(), action: 'delete', bucketlist: all_checked_val,all_selected:all_selected,pattern:$('#pattern').val()}; 
            $.ajax({
                url: '/redis/manage-keys',
                type: 'post',
                dataType: 'json',
                data:data,
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success: function (json) {
                    if(typeof json['error']!='undefined' && json['error']!=''){
                        alertPopup(json['error'],'error');
                    }else if(typeof json['auth_error']!='undefined' && $.trim(json['auth_error'])==1){
                        window.location.href= '/redis/manage-keys';
                    }else if(typeof json['success']!='undefined' && $.trim(json['success'])!=''){
                        //If radio button is checked and all key has been deleted then get the form action URL and refresh the page
                        if(typeof json['all_deleted']!='undefined' && $.trim(json['all_deleted'])==1){
                            var act = $('#SearchKeyForm').attr('action');
                        }else{
                            $('table#load_more_results tr.chkbox_selected_key').remove();                        
                            //If all data is deleted then display no record found.
                            if(typeof json['total_delete']!='undefined' && $.trim(json['total_delete'])!=''){
                                var tot_rec_found=($('#tot_rec').val()-json['total_delete']);

                                //If all cache is deleted for the selected search then redirect to current page's action
                                if($('#tot_rec').val()==json['total_delete']){
                                   var act = $('#SearchKeyForm').attr('action');
                                }  

                               $('#tot_records').html('Total '+tot_rec_found+' Record(s) Found');
                               $('#tot_rec').val(tot_rec_found);
                            }
                        }
                        alertPopup($.trim(json['success']),'success',act);                        
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {                    
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                    
                }
            });
            $('#ConfirmPopupArea').modal('hide');
        });
        return false;
    }else{
        alertPopup('There is no key selected to delete.','error');
    }  
}
/*Created :Rohit Shrotriya
 * Dated : 16 May 2017
 * Description :get cache detail form cache by cache name
 * 
 */
function getRedisValue(rval){
    var data ='';
    var bucket_val= '';
    if(rval !=''){
        bucket_val=$('select[name="bucket"]').val();//bucket like staic,default
       data={cachename:rval,bucket:bucket_val}; 
       $.ajax({
                url: '/redis/get-cache-detail-by-name',
                type: 'post',
                dataType: 'json',
                data:data,
                headers: {'X-CSRF-TOKEN': jsVars._csrfToken},
                success: function (json) {
                    if(json == 'session_logout'){
                        window.location.reload(true);
                    }else if(typeof json['error']!='undefined' && json['error']!=''){
                        alertPopup(json['error'],'error');
                    }else if(typeof json['success']!='undefined' && $.trim(json['success'])!=''){
                            $("#cache_detail_popup").trigger('click');
                            $("#mainData").html($.trim(json['detail']));
                                                          
                    }else{
                        alertPopup('Some error occur ,please try again .','error'); 
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {                    
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);                    
                }
            });
    }else{
       alertPopup('Cache Name not found .','error'); 
    }
   
}


