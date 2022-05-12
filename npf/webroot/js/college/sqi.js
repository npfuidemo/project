$(document).ready(function () {
//    $.material.init();
//    table_fix_rowcol();
//	$('[data-toggle="popover"]').popover();

    $('#tw_board_list').SumoSelect({placeholder: 'Board Board', search: true, searchText:'Board Name',  triggerChangeCombined: false,okCancelInMulti:true});
    $('#tenth_board').SumoSelect({placeholder: 'Board Board', search: true, searchText:'Board Name',  triggerChangeCombined: false,okCancelInMulti:true});
    $('#graduation_university').SumoSelect({placeholder: 'Board Board', search: true, searchText:'Board Name',  triggerChangeCombined: false,okCancelInMulti:true});
    $('#post_graduation_university').SumoSelect({placeholder: 'Board Board', search: true, searchText:'Board Name',  triggerChangeCombined: false,okCancelInMulti:true});
     LoadReportDateRangepicker();
});


function LoadFormsOnDashboard(value, default_val,multiselect,module) {
    if(typeof multiselect =='undefined'){
        multiselect = '';
    }
    $.ajax({
        url: '/voucher/get-forms',
        type: 'post',
        dataType: 'html',
        //data:  'field_type='+field_type+'&hidden_id='+hidden_id.value,
        data: {
            "college_id": value,
            "default_val": default_val,
            "multiselect":multiselect
        },
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        success: function (data) {
            if(data=="session_logout"){
                window.location.reload(true);
            }
            $('#div_load_forms').html(data);
            $('.div_load_forms').html(data);
            $('#div_load_forms select > option:first-child').text('All Forms');
            $('.chosen-select').chosen();
            $('.chosen-select-deselect').chosen({allow_single_deselect: true});

        },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}

function getSqiData() {
    $("#listloader").show();
    var data = $('#studen_quality_index').serializeArray();
    $.ajax({
        url: '/colleges/ajax-sqi',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:true,
        beforeSend: function () {
            $('#seacrhList').attr('disabled','true');
         },
        success: function (data) {
            $("#listloader").hide();
            $('.offCanvasModal').modal('hide');
            $('#seacrhList').removeAttr('disabled');
            if(data['error']=="session_logout"){
                window.location.reload(true);
            }else if(data['status']==200){
                if(typeof data['data']=='undefined' || data['data']==''){
                    $("#college_message").html("");
                    $("#college_message").html('<div class="aligner-middle"><div class="text-center text-info font16"><span class="lineicon-43 alignerIcon"></span><br><span id="load_msg">Please select an Institute Name from filter and click apply to view result.</span></div></div>');
                    return false;
                }
                $(".error-message").html("");
                $("#college_message").hide();$("#graphDivids").show();$("#age").html("");$("#averageAge").html("");$("#gender_ratio").html("");$("#10thboards").html("");$("#10thmarksgroups").html("");
                $("#12thboards").html("");$("#12thmarksgroups").html("");$("#graduation_graph").html("");$("#group_graduation_thboards").html("");
                $("#post_graduation_thboards").html("");$("#group_post_graduation_thboards").html("");$("#ratio").html('');$("#boardList").html('');
                $("#post_graduation_thmarksgroups").html('');$("#graduation_thmarksgroups").html('');$("#examGraph").html('');$("#tw_applicant").html('');
                $("#tw_boardList").html('');$(".map-img-right").html("");$("#table").html("");$(".indigraph_container").hide();$(".intrance_exam").hide();
                $('.post_graduation_graph_group').hide();$('.graduation_graph_group').hide();$(".graduation_block").hide();$(".post_graduation_block").hide();
                $('.tenth_block').hide();$('.tw_block').hide();$("#percentageFemale").hide();$("#pecentDownUp").hide();
                var fid = $("#form_id").val();
                $("#enrolments").hide();
                $("#enrolments").removeClass('active');
                $("#registration").addClass('active');
                if(fid==0){
                    $("#conversion").hide();
                }else{
                     $("#conversion").show();
                    if (typeof data.data.isEnrollmentEnabled != 'undefined' && data.data.isEnrollmentEnabled==1) {
                        if (typeof data.data.isEnrollmentConfigured != 'undefined' && data.data.isEnrollmentConfigured==1) {
                            //alert('Do not show Graph');
                        }
                        $("#enrolments").show();
                        $("#enrolments").html(data.data.enrollmentLabel);
                    }
                }

                if(typeof data.data.age !='undefined' && typeof data['data']['age']['graphdata']!='undefined' && data['data']['age']['graphdata']!=''){
                    $(".ageGraph").show();
                    makeAgeGraph(data['data']['age']['graphdata']);
                    $("#averageAge").html("Average age of your Applicants is <strong>" + data['data']['age']['insight']['average']+ "</strong> years.");
                }else{
                    $(".ageGraph").hide();
                }
                if(typeof data.data.gender !='undefined' && data['data']['gender'] !=''){
                    $(".genderGraph").show();
                    simplePieChartSqi(data['data']['gender']['graphdata']);
                    if(typeof data['data']['gender']['insight']['ratio']!='undefined' &&  data['data']['gender']['insight']['ratio']!=''){
                        $("#ratio").html(data['data']['gender']['insight']['ratio']);
                        $("#ratio").show();
                    }else{
                        $("#ratio").hide();
                    }
                }else{
                    $(".genderGraph").hide();
                }
                if(typeof data.data.location!='undefined'){
                    if(typeof data['data']['location']['table']!='undefined' && data['data']['location']['table']!='' && data['data']['location']['table']!=null){
                        $(".indigraph_container").show();
                        tableGraph(data['data']['location']['table']);
                        if(typeof data['data']['location']['insight']!='' && typeof data.data.location.insight!='undefined' && data.data.location.insight !== null){
                            $("#location_insigth").html(data['data']['location']['insight']['higestPercentage']);
                        }
                    }
                    if(typeof data['data']['location']['indiGraph']!='undefined' && data['data']['location']['indiGraph']!='' && data['data']['location']['indiGraph']!=null){
                        $(".indigraph_container").show();
                        indiGraph(data['data']['location']['indiGraph']);
                    }
                }
                if(fid!='' && fid!=0){
                    //gender insigth
                    if(typeof data.data.gender!='undefined' && typeof data['data']['gender']['insight']['formPercent']!='undefined' &&  data['data']['gender']['insight']['formPercent']!=''){
                        $("#percentageFemale").show();
                        $("#percentageFemale").html("<strong>"+data['data']['gender']['insight']['formPercent'] + "</strong> % of your applicants is Female, which is "+ data['data']['gender']['insight']['lessthanper'] + "% at your college level.");
                    }
                    if(typeof data.data.gender!='undefined' && typeof data['data']['gender']['insight']['pecentDownUp']!='undefined' &&  data['data']['gender']['insight']['pecentDownUp']!=''){
                        $("#pecentDownUp").show();
                        $("#pecentDownUp").html(data['data']['gender']['insight']['pecentDownUp']);
                    }
                    //end
                    //$(".onformselect").show();
                    //tenth board
                    if(typeof data['data']['10thboards']!='undefined' && data['data']['10thboards']!=''){
                        $(".tenth_boards").show();
                        $(".tenth_block").show();
                        simplePieChartSqi(data['data']['10thboards']['graphdata']);
                        //insight
                        if(typeof data['data']['10thboards']['insight']['boardList']!='undefined' &&  data['data']['10thboards']['insight']['boardList']!=''){
                            $("#boardList").html(data['data']['10thboards']['insight']['boardList']);
                        }
                    }else{
                        $(".tenth_boards").hide();
                    }
                    //12th boards
                    if(typeof data['data']['12thboards']!='undefined' && data['data']['12thboards']['graphdata']['content']!==''){
                        $(".twth_graph").show();$('.tw_block').show();
                        simplePieChartSqi(data['data']['12thboards']['graphdata']);
                        //insight
                        if(typeof data['data']['12thboards']['insight']['boardList']!=='undefined' &&  data['data']['12thboards']['insight']['boardList']!==''){
                            $("#tw_boardList").html(data['data']['12thboards']['insight']['boardList']);
                        }else{
                            $("#tw_boardList").hide();
                        }
                    }else{
                        $(".twth_graph").hide();
                    }
                    //12 graph group
                    if(typeof data['data']['12thboardsGroup']!='undefined' && data['data']['12thboardsGroup']!=='' && data['data']['12thboardsGroup']!==null){
                        $(".twth_graph_group").show();$('.tw_block').show();
                        makeColumnBarGraphSqi(data['data']['12thboardsGroup']['graphdata']);
                        if(typeof data['data']['12thboardsGroup']['insight'] !='undefined' && data['data']['12thboardsGroup']['insight']!==''){
                            $("#tw_applicant").html(data['data']['12thboardsGroup']['insight']);
                            $("#tw_applicant").show();
                        }else{
                            $("#tw_applicant").hide();
                        }
                    }else{
                        $(".twth_graph_group").hide();
                        $("#tw_applicant").hide();
                    }
                    //10th board group
                    if(typeof data['data']['10thboardsGroup']!='undefined' && data['data']['10thboardsGroup']!=='' && data['data']['10thboardsGroup']!==null){
                        $('.tenth_boards_group').show();$('.tenth_block').show();
                        makeColumnBarGraphSqi(data['data']['10thboardsGroup']['graphdata']);
                        if(typeof data['data']['10thboardsGroup']['insight'] !='undefined' && data['data']['10thboardsGroup']['insight']!==''){
                            $("#applicant").html(data['data']['10thboardsGroup']['insight']);
                        }else{
                            $("#applicant").hide();
                        }
                    }else{
                        $('.tenth_boards_group').hide();
                    }
                    //end 10th group
                    //post graduation
                    if(typeof data['data']['post_graduationtgraph']!='undefined' && typeof data['data']['post_graduationtgraph']['graphdata']!='undefined' && data['data']['post_graduationtgraph']['graphdata']!='' && data['data']['post_graduationtgraph']['graphdata']!=null){
                        $(".post_graduation_block").show();
                        simplePieChartSqi(data['data']['post_graduationtgraph']['graphdata']);
                        //insight
                        if(typeof data['data']['post_graduationtgraph']['insight']['boardList']!=='undefined' &&  data['data']['post_graduationtgraph']['insight']['boardList']!==''){
                            $("#post_graduation_list").show();
                            $("#post_graduation_list").html(data['data']['post_graduationtgraph']['insight']['boardList']);
                        }else{
                            $("#post_graduation_list").hide();
                        }
                    }
                    if(typeof data['data']['graduationtgraph']!='undefined' && typeof data['data']['graduationtgraph']['graphdata']!='undefined' && data['data']['graduationtgraph']['graphdata']!='' && data['data']['graduationtgraph']['graphdata']!=null){
                        $(".graduation_block").show();
                        simplePieChartSqi(data['data']['graduationtgraph']['graphdata']);
                        //insight
                        if(typeof data['data']['graduationtgraph']['insight']['boardList']!=='undefined' &&  data['data']['graduationtgraph']['insight']['boardList']!==''){
                            $("#graduation_board").show();
                            $("#graduation_board").html(data['data']['graduationtgraph']['insight']['boardList']);
                        }else{
                            $("#graduation_board").hide();
                        }
//
                    }
                    if(typeof data['data']['graduationtgraph_group']!='undefined' && data['data']['graduationtgraph_group']['graphdata']!='' && data['data']['graduationtgraph_group']['graphdata']!=null){
                        //lineChanrtGroup(data['data']['graduationtgraph_group']);
                        $('.graduation_graph_group').show();
                        $(".graduation_block").show();
                        makeColumnBarGraphSqi(data['data']['graduationtgraph_group']['graphdata']);
                        $("#graduation_applicant").show();
                        if(typeof data['data']['graduationtgraph_group']['insight']!='undefined' && data['data']['graduationtgraph_group']['insight']!='' && data['data']['graduationtgraph_group']['insight']!=null){
                            $("#graduation_applicant").html(data['data']['graduationtgraph_group']['insight']);
                        }else{
                            $("#graduation_applicant").hide();
                            $("#graduation_applicant").html('');
                        }
                    }
                    if(typeof data['data']['post_graduation_thmarksgroups']!='undefined' && data['data']['post_graduation_thmarksgroups']['graphdata']!='' && data['data']['post_graduation_thmarksgroups']['graphdata']!=null){
                        $('.post_graduation_graph_group').show();
                        $(".post_graduation_block").show();
                        makeColumnBarGraphSqi(data['data']['post_graduation_thmarksgroups']['graphdata']);
                        $("#post_graduation_applicant").show();
                        if(typeof data['data']['graduationtgraph_group']['insight']!='undefined' && data['data']['graduationtgraph_group']['insight']!='' && data['data']['graduationtgraph_group']['insight']!=null){
                            $("#post_graduation_applicant").html(data['data']['post_graduation_thmarksgroups']['insight']);
                        }else{
                            $("#post_graduation_applicant").hide();
                            $("#post_graduation_applicant").html('');
                        }
                    }
                    if(typeof data.data.cat_xt_score!='undefined' && data['data']['cat_xt_score']!='' && data['data']['cat_xt_score']!=null){
                        $(".intrance_exam").show();
                        makeColumnBarGraphSqi(data['data']['cat_xt_score']['graph']);
                        if(typeof data['data']['cat_xt_score']['insigth']['maximum_num']!='undefined' && data['data']['cat_xt_score']['insigth']['maximum_num']!=''){
                            $("#exam_insigth").html(data['data']['cat_xt_score']['insigth']['maximum_num']);
                            $("#exam_insigth").show();
                        }else{
                            $("#exam_insigth").hide();
                        }
                        if(typeof data['data']['cat_xt_score']['insigth']['maximum_board']!='undefined' && data['data']['cat_xt_score']['insigth']['maximum_board']!=''){
                            $("#maximum_board").html(data['data']['cat_xt_score']['insigth']['maximum_board']);
                        }else{
                            $("#maximum_board").hide();
                        }
                    }

                }
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('.chosen-select').trigger('chosen:updated');
            }else{
                $("#college_message").html("");
                $("#college_message").show();
                $("#graphDivids").hide();
                $("#college_message").html('<div class="aligner-middle"><div class="text-center font16"><span class="lineicon-43 alignerIcon"></span><br><span class="text-danger" id="load_msg">' + data['error'] + '</span></div></div>');
            }
            $("#listloader").hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
}


function makeAgeGraph(json){
$('#'+json['id_container']).html('');
google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawBasic);
function drawBasic() {
      var data = google.visualization.arrayToDataTable(json['content']);
      var options = {
        title: '',
		chartArea: {left:'15%', top: '5%', width: "80%", height: "75%" },
        hAxis: {
          title: 'Total Number of Applicants',
          minValue: 0
        },
        vAxis: {
          title: 'Age Group'
        },
        legend: { position: 'none' },
      };
      var chart = new google.visualization.BarChart(document.getElementById(json['id_container']));
      chart.draw(data, options);
    }
}

function lineChanrtGroup(json){
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawVisualization);
    function drawVisualization() {
    // Some raw data (not necessarily accurate)
    var data = google.visualization.arrayToDataTable(json['content']);
    var options = {
      title : json['title'],
      vAxis: {title: 'Applicants'},
      hAxis: {title: 'Borads'},
      seriesType: 'bars',
      series: {5: {type: 'line'}}
    };
    var chart = new google.visualization.ComboChart(document.getElementById(json['id_container']));
    chart.draw(data, options);
  }
}
//get unversity group
$(document).on('change', '#studen_quality_index select#form_id', function () {
    var fid = $("#form_id").val();
    var college_id = $("#college_id").val();
    if(typeof fid!='undefined' && fid!=0 && fid!=''){
        $("#listloader").show();
        $.ajax({
            url: '/colleges/get-university',
            type: 'post',
            dataType: 'json',
            data: {
                "form_id": fid,"college_id":college_id
            },
            headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
            //async:false,
            success: function (data) {
                if(data=="session_logout"){
                    window.location.reload(true);
                }
                $("#tw_board_list").html(data.twthuniversity);
                $("#tenth_board").html(data.tenth_university);
                $("#post_graduation_university").html(data.post_graduation_university);
                $("#graduation_university").html(data.graduation_university);
                last_valid_selection = $('#tenth_board').val();
                last_valid_selection_tw = $('#tw_board_list').val();
                last_valid_selection_gr = $('#graduation_university').val();
                last_valid_selection_pgr = $('#post_graduation_university').val();
                $('.chosen-select').chosen();
                $('.chosen-select-deselect').chosen({allow_single_deselect: true});
                $('#tw_board_list')[0].sumo.reload();
                $('#tenth_board')[0].sumo.reload();
                $('#post_graduation_university')[0].sumo.reload();
                $('#graduation_university')[0].sumo.reload();
                $("#listloader").hide();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
});

//prevent to select more than 5 boards;
$('#tenth_board').change(function (event) {
    if ($('#tenth_board').val() != null && $('#tenth_board').val().length > 5) {
        alert('Max 5 selections allowed!');
        var $this = $(this);
        var optionsToSelect = last_valid_selection;
        $this[0].sumo.unSelectAll();
        $.each(optionsToSelect, function (i, e) {
            $this[0].sumo.selectItem($this.find('option[value="' + e + '"]').index());
        });
        last_valid_selection    = optionsToSelect;
    } else if($('#tenth_board').val() != null){
        last_valid_selection = $(this).val();
    }
});

$('#tw_board_list').change(function (event) {
    if ($('#tw_board_list').val() != null && $('#tw_board_list').val().length > 5) {
        alert('Max 5 selections allowed!');
        var $this = $(this);
        var optionsToSelect = last_valid_selection_tw;
        $this[0].sumo.unSelectAll();
        $.each(optionsToSelect, function (i, e) {
            $this[0].sumo.selectItem($this.find('option[value="' + e + '"]').index());
        });
        last_valid_selection_tw    = optionsToSelect;
    } else if($('#tw_board_list').val() != null){
        last_valid_selection_tw = $(this).val();
    }
});

$('#graduation_university').change(function (event) {
    if ($('#graduation_university').val() != null && $('#graduation_university').val().length > 5) {
        alert('Max 5 selections allowed!');
        var $this = $(this);
        var optionsToSelect = last_valid_selection_gr;
        $this[0].sumo.unSelectAll();
        $.each(optionsToSelect, function (i, e) {
            $this[0].sumo.selectItem($this.find('option[value="' + e + '"]').index());
        });
        last_valid_selection_gr    = optionsToSelect;
    }else if($('#graduation_university').val() != null){
        last_valid_selection_gr = $(this).val();
    }
});

$('#post_graduation_university').change(function (event) {
    if ($('#post_graduation_university').val() != null && $('#post_graduation_university').val().length > 5) {
        alert('Max 5 selections allowed!');
        var $this = $(this);
        var optionsToSelect = last_valid_selection_pgr;
        $this[0].sumo.unSelectAll();
        $.each(optionsToSelect, function (i, e) {
            $this[0].sumo.selectItem($this.find('option[value="' + e + '"]').index());
        });
        last_valid_selection_pgr    = optionsToSelect;
    }else if($('#post_graduation_university').val() != null){
        last_valid_selection_pgr = $(this).val();
    }
});
//end prevent to select more than 5
$(document).on('click',".tenth_block .btnOk",function(){
    $("#listloader").show();
    var data = $('#studen_quality_index').serializeArray();
    data.push({name: "type", value: "tenth_class"});
    $.ajax({
        url: '/colleges/getBoardGroupList',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        success: function (data) {
            $("#tenth_error").html("");
            if(data['status']==200){
                if(typeof data['data']['10thboardsGroup'] != 'undefined' && data['data']['10thboardsGroup']!='' && data['data']['10thboardsGroup'] != null){
                    //makeColumnBarGraphSqi(data['data']['10thboardsGroup']);
                    $(".tenth_boards_group").show();
                    makeColumnBarGraphSqi(data['data']['10thboardsGroup']['graphdata']);
                    $("#applicant").html('');
                    $("#applicant").html(data['data']['10thboardsGroup']['insight']);
                } else {
                    $(".tenth_boards_group").hide();
                    $("#applicant").html('');
                }
                if(typeof data['data']['10thboards']!='undefined' && data['data']['10thboards']!='' && data['data']['10thboards'] != null){
                    $(".tenth_boards").show();
                    $(".tenth_block").show();
                    simplePieChartSqi(data['data']['10thboards']['graphdata']);
                    //insight
                    if(typeof data['data']['10thboards']['insight']['boardList']!='undefined' &&  data['data']['10thboards']['insight']['boardList']!=''){
                        $("#boardList").html(data['data']['10thboards']['insight']['boardList']);
                    }
                }else{
                    $(".tenth_boards").hide();
                }
            }else{
                $("#tenth_error").html(data['error']);
            }
            $("#listloader").hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});
//
$(document).on('click',".tw_block .btnOk",function(){
    $("#listloader").show();
    var data = $('#studen_quality_index').serializeArray();
    data.push({name: "type", value: 'tw_class'});
    $.ajax({
        url: '/colleges/getBoardGroupList',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        success: function (data) {
            $("#tw_error").html("");
            if(data['status']==200){
                if(data['data']['12thboardsGroup']!='' && data['data']['12thboardsGroup']!= null){
                    $(".twth_graph_group").show();
                    makeColumnBarGraphSqi(data['data']['12thboardsGroup']['graphdata']);
                    $("#tw_applicant").html(data['data']['12thboardsGroup']['insight']);
                    $("#tw_applicant").show();
                } else {
                    $(".twth_graph_group").hide();
                }
                //12th boards
                if(typeof data['data']['12thboards']!='undefined' && data['data']['12thboards']['graphdata'] !='' && data['data']['12thboards'] != null && data['data']['12thboards'].length != 0){
                    $(".twth_graph").show();$('.tw_block').show();
                    simplePieChartSqi(data['data']['12thboards']['graphdata']);
                    //insight
                    if(typeof data['data']['12thboards']['insight']['boardList']!=='undefined' &&  data['data']['12thboards']['insight']['boardList']!==''){
                        $("#tw_boardList").html(data['data']['12thboards']['insight']['boardList']);
                    }
                }else{
                    $(".twth_graph").hide();
                }
            }else{
                $("#tw_error").html(data['error']);
            }
            $("#listloader").hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});
//graduation search
$(document).on('click',".graduation_block .btnOk",function(){
    $("#listloader").show();
    var data = $('#studen_quality_index').serializeArray();
    data.push({name: "type", value: 'graduation_class'});
    $.ajax({
        url: '/colleges/getBoardGroupList',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        success: function (data) {
            $("#graduation_error").html("");
            if(data['status']==200){
                $("#graduation_graph, #graduation_board, .graduation_graph_group, #graduation_thmarksgroups").show();
                if(typeof data['data']['graduationtgraph_group'] != 'undefined' && data['data']['graduationtgraph_group']!='' && data['data']['graduationtgraph_group'].length != 0){
                    makeColumnBarGraphSqi(data['data']['graduationtgraph_group']['graphdata']);
                    $("#graduation_applicant").show();
                    $("#graduation_graph").show();
                    $("#graduation_applicant").html(data['data']['graduationtgraph_group']['insight']);
                } else {
                    $(".graduation_graph_group, #graduation_board").hide();
                }
                if(typeof data['data']['graduationtgraph']!='undefined' && typeof data['data']['graduationtgraph']['graphdata']!='undefined' && data['data']['graduationtgraph']['graphdata']!='' && data['data']['graduationtgraph']['graphdata']!=null && data['data']['graduationtgraph'].length != 0){
                    $(".graduation_block").show();
                    $("#graduation_thmarksgroups").show();
                    $("#graduation_board").show();
                    $("#graduation_board").closest('div').show();
                    $("#graduation_graph").show();
                    simplePieChartSqi(data['data']['graduationtgraph']['graphdata']);
                    //insight
                    if(typeof data['data']['graduationtgraph']['insight']['boardList']!=='undefined' &&  data['data']['graduationtgraph']['insight']['boardList']!==''){
                        $("#graduation_board").closest('div').show();
                        $("#graduation_graph").show();
                        $("#graduation_board").show();
                        $("#graduation_board").html(data['data']['graduationtgraph']['insight']['boardList']);
                    } else {
                        $("#graduation_graph").html("");
                        $("#graduation_graph").hide();
                        $("#graduation_board").closest('div').hide();
                    }
                } else {
                    $("#graduation_graph").html("");
                    $("#graduation_graph, #graduation_board").hide();
                    $("#graduation_board").closest('div').hide();
                }
            }else{
                $("#graduation_error").html(data['error']);
            }
            $("#listloader").hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});
//post gradtion search
$(document).on('click',".post_graduation_block .btnOk",function(){
    $("#listloader").show();
    var data = $('#studen_quality_index').serializeArray();
    data.push({name: "type", value: 'post_graduation_class'});
    $.ajax({
        url: '/colleges/getBoardGroupList',
        type: 'post',
        dataType: 'json',
        data: data,
        headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
        async:false,
        success: function (data) {
            $("#post_graduation_error").html("");
            if(data['status']==200){
                if(data['data']['post_graduation_thmarksgroups']!=''){
                    makeColumnBarGraphSqi(data['data']['post_graduation_thmarksgroups']['graphdata']);
                    $("#post_graduation_applicant").show();
                    $("#post_graduation_applicant").html(data['data']['post_graduation_thmarksgroups']['insight']);
                }
                if(typeof data['data']['post_graduationtgraph']!='undefined' && typeof data['data']['post_graduationtgraph']['graphdata']!='undefined' && data['data']['post_graduationtgraph']['graphdata']!='' && data['data']['post_graduationtgraph']['graphdata']!=null){
                    $(".post_graduation_block").show();
                    simplePieChartSqi(data['data']['post_graduationtgraph']['graphdata']);
                    //insight
                    if(typeof data['data']['post_graduationtgraph']['insight']['boardList']!=='undefined' &&  data['data']['post_graduationtgraph']['insight']['boardList']!==''){
                        $("#post_graduation_list").show();
                        $("#post_graduation_list").html(data['data']['post_graduationtgraph']['insight']['boardList']);
                    }
                }
            }else{
                $("#post_graduation_error").html(data['error']);
            }
            $("#listloader").hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
        }
    });
});

function tableGraph(json){
    if(json==null || json['content'].length == 0) {
       $('#table_graph').html('<h4 class="text-danger" style="padding:40px">Data Not Found</h4>');
    }else{
     google.charts.load('current', {'packages':['table']});
      google.charts.setOnLoadCallback(drawTable);
      function drawTable() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'State');
        data.addColumn('number', '% of '+json['lebel']+'.');
        data.addRows(json['content']);
        var table = new google.visualization.Table(document.getElementById(json['id_container']));
        table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
      }
  }
}
/**
 * india graph js
 * @param {type} json
 * @returns {undefined}
 */
function indiGraph(json){

    var rgbcolor = ['rgba(117,183,64,1)','rgba(117,183,64,0.85)','rgba(117,183,64,0.7)','rgba(117,183,64,0.55)','rgba(117,183,64,0.4)','rgba(117,183,64,0.3)','rgba(117,183,64,0.25)','rgba(117,183,64,0.2)','rgba(117,183,64,0.15)','rgba(117,183,64,0.1)'];

    if(json==null || typeof json['data']=='undefined' || json['data']==null) {
       $('.map-img-right').html('<h4 class="text-danger" style="padding:40px">Data Not Found</h4>');
    }else{
    var data = JSON.parse(json['data']);
    var title = JSON.parse(json['title']);
    var arrayLength = json['object'].length;
    var arcdata = data;
                arcpin = title;
                var width = '100%',
                    height = 500;
                var projection = d3.geo.mercator().scale(860).translate([-1010, 620]);
                var path = d3.geo.path().projection(projection);
                var svg = d3.select(".map-img-right").append("svg").attr("width", width).attr("height", height);
                var states = svg.append("g").attr("class", "states");
                var arcs = svg.append("g").attr("class", "arcs");
                var centered;
                d3.json("/js/graph/india_map_d3.json",
                    function(error, geodata) {
                        states.selectAll("path").data(topojson.feature(geodata, geodata.objects.states).features).enter().append("path").attr("d", path).style("fill", function(d) {
//
                            for (var i = 0; i < arrayLength; i++) {
                                if (d.properties.OBJECTID == json['object'][i]) {
                                    return rgbcolor[i];
//                                    return "rgb(160, 195, "+color+")";
                                }
                            }

                        });
                        arcs.selectAll("path").data(arcdata).enter().append("path").attr("d", function(d) {
                            return lngLatToArc(d, "sourceLocation", "targetLocation", .9);
                        });
                        var tip = d3.tip().attr("class", "d3-tip").offset([-5, 0]).style("left", "300px").style("top", "400px").html(function(d) {
                            return (arcpin[d[0] + ", " + d[1]]);
                        })
                        svg.call(tip);
                        (arcdata[0].location.targetLocation);
                        var coordinates = projection(arcdata[0].location.sourceLocation);
                        svg.append("circle").attr("cx", coordinates[0]).attr("cy", coordinates[1]).attr("r", 7).style("fill", "#c43030");
                        var temparc = [];
                        for (var i = 0; i < arrayLength; i++) {
                            temparc.push(arcdata[i].location.targetLocation);
                        }

//                            fruits.push("Kiwi");
                        arcs.selectAll("circle").data(temparc).enter().append("circle").attr("cx", function(d) {
                            return projection(d)[0];
                        }).attr("cy", function(d) {
                            return projection(d)[1];
                        }).attr("r", "5").attr("fill", "rgb(0,0,0)").on("mouseover", tip.show).on("click", tip.hide);
                    });

                function lngLatToArc(d, sourceName, targetName, bend) {
                    bend = bend || 1;
                    var sourceLngLat = d.location[sourceName],
                        targetLngLat = d.location[targetName];
                    if (targetLngLat && sourceLngLat) {
                        var sourceXY = projection(sourceLngLat),
                            targetXY = projection(targetLngLat);
                        var sourceX = sourceXY[0],
                            sourceY = sourceXY[1];
                        var targetX = targetXY[0],
                            targetY = targetXY[1];
                        var dx = targetX - sourceX,
                            dy = targetY - sourceY,
                            dr = Math.sqrt(dx * dx + dy * dy) * bend;
                        var west_of_source = (targetX - sourceX) < 0;
                        if (west_of_source) return "M" + targetX + "," + targetY + "A" + dr + "," + dr + " 0 0,1 " + sourceX + "," + sourceY;
                        return "M" + sourceX + "," + sourceY + "A" + dr + "," + dr + " 0 0,1 " + targetX + "," + targetY;
                    } else {
                        return "M0,0,l0,0z";
                    }
                }
            }

}


    $(document).ready(function(){
        if($("#registration").length>0){
            $(document).on('click',"#registration",function(){
            $("#registration").addClass('active');
            $("#conversion").removeClass('active');
            $("#enrolments").removeClass('active');
            $("#listloader").show();
            var data = $('#studen_quality_index').serializeArray();
            data.push({name: "type", value: 'registration'});
            $.ajax({
                url: '/colleges/infoIndiaRegistration',
                type: 'post',
                dataType: 'json',
                data: data,
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                async:false,
                success: function (data) {
                    if(data['status']==200){
                        $("#location_insigth_div").show();
                        $("#table_graph").html('');
                        $(".map-img-right").html("");
                        tableGraph(data['data']['location']['table']);
                        if(typeof data['data']['location']['indiGraph']!='undefined' && data['data']['location']['indiGraph']!=null){
                            indiGraph(data['data']['location']['indiGraph']);
                        }
                        if(typeof data['data']['location']['insight']!='' && typeof data.data.location.insight!='undefined' && data.data.location.insight !== null){
                            $("#location_insigth").html(data['data']['location']['insight']['higestPercentage']);
                        }else{
                            $("#location_insigth_div").hide();
                            $("#location_insigth").html("");
                        }
                    }else{
                        //$("#tw_error").html(data);
                    }
                    $("#listloader").hide();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
           });
        }
        //conversion rate in location
        if($("#conversion").length>0){
            $(document).on('click',"#conversion",function(){
            $("#registration").removeClass('active');
            $("#enrolments").removeClass('active');
            $("#conversion").addClass('active');
            $("#listloader").show();
            var data = $('#studen_quality_index').serializeArray();
            data.push({name: "type", value: 'conversion'});
            $.ajax({
                url: '/colleges/infoIndiaRegistration',
                type: 'post',
                dataType: 'json',
                data: data,
                headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                async:false,
                success: function (data) {
                    $(".conversion_error").html('');
                    $("#location_insigth_div").show();
                    if(data['status']==200){
                        $("#table_graph").html('');
                        $(".map-img-right").html("");
                        tableGraph(data['data']['location']['table']);
                        indiGraph(data['data']['location']['indiGraph']);
                        if(typeof data['data']['location']['insight']!='' && typeof data.data.location.insight !='undefined' && data.data.location.insight !== null){
                            $("#location_insigth").html(data['data']['location']['insight']['higestPercentage']);
                        }else{
                            $("#location_insigth_div").hide();
                        }
                    }else{
                        $(".conversion_error").html(data['error']);
                    }
                    $("#listloader").hide();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                }
            });
           });
        }

        //conversion rate in location
        if ($("#enrolments").length > 0) {
            $(document).on('click', "#enrolments", function () {
                $("#registration").removeClass('active');
                $("#conversion").removeClass('active');
                $("#enrolments").addClass('active');
                $("#listloader").show();
                var data = $('#studen_quality_index').serializeArray();
                data.push({name: "type", value: 'enrolments'});
                $.ajax({
                    url: '/colleges/infoIndiaRegistration',
                    type: 'post',
                    dataType: 'json',
                    data: data,
                    headers: {'X-CSRF-TOKEN': jsVars.csrfToken},
                    async: false,
                    success: function (data) {
                        $(".conversion_error").html('');
                        $("#location_insigth_div").show();
                        if (data['status'] == 200) {
                            $("#table_graph").html('');
                            $(".map-img-right").html("");

                            tableGraph(data['data']['location']['table']);

                            indiGraph(data['data']['location']['indiGraph']);

                            if(typeof data['data']['location']['insight']!='' && typeof data.data.location.insight!='undefined' && data['data']['location']['insight']!=null){
                                $("#location_insigth").html(data['data']['location']['insight']['higestPercentage']);
                            }else{
                                $("#location_insigth_div").hide();
                            }

                            if(data['data']['location']['table']!=null && typeof data['data']['location']['table']['isEnrollmentConfigured'] !='undefined' &&
                                    data['data']['location']['table']['isEnrollmentConfigured']!=null &&
                                    data['data']['location']['table']['isEnrollmentConfigured']==0){
                                $("#location_insigth_div").hide();
				$('.map-img-right').append('<div class="enrollMsg-section"></div><p class="enrollment-Graphtext"><i class="fa fa-cogs" aria-hidden="true"></i> Final Enrolments not configured for the institute.<br> To get a complete lead to enrolment view, Please get it configured</p>');

                            }

                        } else {
                            $(".conversion_error").html(data['error']);
                        }
                        $("#listloader").hide();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
                    }
                });
            });
        }

    });

function ResetFilterValue(){

    $("#graphDivids").hide();
    $("#college_message").show();
    $('#studen_quality_index').find('input[type="text"]').each(function(){
       $(this).val('');
    });
     $('#studen_quality_index').find('input[type="text"]').each(function(){
       $(this).val('');
    });
    $('#studen_quality_index').find('select').each(function(){
       this.selected = false;
       $(this).val('');
       $(this).trigger("chosen:updated");
    });

}

function sqiGetInfoPopup(){
    var html = $('#popupContentText').html();
    $('#ActivityLogPopupArea .modal-body').removeClass('text-center');
    $('#ActivityLogPopupArea .modal-header').addClass('offCanvasModalheader').html('<button aria-hidden="true" data-dismiss="modal" class="close" type="button" data-toggle="tooltip" data-placement="left" title="Click here to close"><span class="glyphicon glyphicon-remove"></span></button><h3 class="modal-title">Student Quality Index</h3>');
    $('#ActivityLogPopupHTMLSection').html(html);
    $('#ActivityLogPopupLink').trigger('click');
    $('[data-toggle="tooltip"]').tooltip();
}

/*
 * crate column graph using param
 * @param json array
 * json['content'] is full rows array ['Publisher', 'Primary', 'Secondary', 'Tertiary'],
 * json['title'] is string
 * json['hAxis_title'] is string
 * json['vAxis_title'] is string
 * json['id_container'] is id for render display graph
 * add below code on ajax success
 * google.charts.load('current', {'packages': ['corechart']});
 */
function makeColumnBarGraphSqi(json){
    $('#'+json['id_container']).html('');
	if(typeof json['height'] != 'undefined') {
		var columnheight = parseInt(json['height']);
	} else {
		var columnheight = 350;
	}
	if(typeof json['legend']!='undefined'){
		if (document.documentElement.clientWidth < 767) {
			var legend = 'top';
		}else{
			var legend = json['legend'];
		}
	}else{
		legend='none';
	}
	var isStacked=false;
	if(typeof json['isStacked']!='undefined'){
		isStacked = json['isStacked'];
	}

    google.charts.load('current', {
        callback: function () {
        var data = google.visualization.arrayToDataTable(json['content']);
        var options = {
            //title: json['title'],
            titlePosition: 'none',
			//chartArea: {left:'10%', top: '10%', width: "85%", height: "70%" },
            vAxis: {
				title: json['vAxis_title'],
				viewWindow:{min:0},
				titleTextStyle: {
					color:'#111',
				},
				textStyle : {
					fontSize: 12,
					color:'#666'
				}
			},
            hAxis: {
				title: json['hAxis_title'],
				textStyle: { fontSize: '14'},
				titleTextStyle: {
					color:'#111',
				},
				textStyle : {
					fontSize: 12,
					color:'#666',
				}
			},
            seriesType: 'bars',
            height: columnheight,
            legend: { position: legend },
            tooltip: {isHtml: true},
            style: { color: 'red' },
            isStacked:isStacked
        };

        //legend_colors
        if(typeof json['legend_colors']!='undefined'){
            legend_colors = json['legend_colors'];
            options.colors=legend_colors;
        }

        $('#'+json['id_container'] + ' h3').remove();
        if($('#'+json['id_container']).parent().find('h3.columnGraphTitle').length){
            $('#'+json['id_container']).parent().find('h3.columnGraphTitle').remove();
        }
        if(typeof json['title'] != 'undefined' && json['title']!='') {
            $('#'+json['id_container']).parent().prepend('<h3 class="columnGraphTitle">'+json['title']+'</h3>');
        }
        var columnChart = new google.visualization.ComboChart(document.getElementById(json['id_container']));
        google.visualization.events.addListener(columnChart, 'ready', downloadGraphAPI);

        var imageId = 'img-'+json['id_container'];
        google.visualization.events.addListener(columnChart, 'ready', function () {
            $("#"+imageId).remove();
            $('#pdf-'+json['id_container']+' h3').text(json['pdf_h3']);
            png = '<img id ="'+imageId+'" src="' + columnChart.getImageURI() + '"/>';
            $('#pdf-'+json['id_container']).append(png);
        });
        columnChart.draw(data, options);
    },
    'packages':['corechart']
    });
}

function simplePieChartSqi(json) {
	if (document.documentElement.clientWidth < 767) {
        width="";
		var legend_pos = 'top';
    }else{
        width='100%';
		var legend_pos = 'right';
    }
    google.charts.load('current', {
        callback: function () {
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Name');
        data.addColumn('number', 'Count');
        data.addRows(json['content']);
        // Set chart options
        var options = {
            title: json['title'],
            height: parseInt(json['height']),
			chartArea: {left:'5%', top: '5%', width: "90%", height: "90%" },
            titleTextStyle: {
                color: '#333',
                fontSize: '16'
            },
            sliceVisibilityThreshold:0,
            //width: (json['width']),
			width: width,
            pieHole: 0.4,
            colors: ['#00b0f0', '#ffc000', '#92d050', '#93cddd', '#e46c0a', '#8a56e2', '#e25668', '#e256ae', '#56e2cf', '#e2cf56'],
            legend: {position: legend_pos, 'alignment': 'center'}
        };
        var chart = new google.visualization.PieChart(document.getElementById(json['id_container']));
        chart.draw(data, options);
    },
    'packages':['corechart']
    });
}
