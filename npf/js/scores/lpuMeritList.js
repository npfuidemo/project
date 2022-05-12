$(document).ready(function (){
    $("#cutOffField").on("change",executeScholarshipLogic);
    $("#cutOffMarks").on("blur",executeScholarshipLogic);
    $('input[name="scholarshipBasis"]').on("click",updateCategoryVal);
    $("#scholarshipBasisField").on("change",executeScholarshipLogic);
    $("#apperingFields").on("change",executeScholarshipLogic);
    $("#resultFields").on("change",executeScholarshipLogic);
    $("#marksField").on("change",executeScholarshipLogic);
    $("#dateFilterField").on("change",changeDateFilterField);
    $("#dateFilterVal").on("blur",changeDateFilterVal);
    $(document).on("blur", ".scholarshipCategoryCriteria",executeScholarshipLogic);
    $("#addMoreCategory").on("click",addMoreScholarshipCategory);
    $("#button_disable").prop('disabled',true);
});

function updateCategoryVal() {
    $(document).find('.scholarshipCategoryCriteria').val('');
    $(document).find('.resetScholarshipList').html('-');
    $(document).find('.scholarshipCategoryCriteriaError').html('');
    var scholarshipBasis    = $('input[name="scholarshipBasis"]:checked').val();
    if(scholarshipBasis === 'percentage') {
        $("#scholarship_basis_th").html('Top Percentage');
        $(document).find('.selectMarksField').hide();
    } else if(scholarshipBasis === 'marks') {
        $("#scholarship_basis_th").html('Top Marks');
        $(document).find('.selectMarksField').show();
    }
}

function changeDateFilterField() {
    var filterField = $(this).val();
    if(filterField === '') {
        $("#dateFilterVal").val('');
    }
    executeScholarshipLogic();
}
function changeDateFilterVal() {
    setTimeout(function(){ executeScholarshipLogic() }, 100);
}

function addMoreScholarshipCategory(){
    var index = $('.scholarshipCategoryCriteria').length;
    var addCategoryHtml = '<tr class="scholarshipCategoriesRow">';
    addCategoryHtml += '<td>Category '+(index+1)+'</td>';
    addCategoryHtml += '<td id="slabPercentage_'+index+'"><input type="text" name="scholarshipCategoryCriteria" class="scholarshipCategoryCriteria form-control maxword100" value="10"><div class="scholarshipCategoryCriteriaError text-left text-danger"></div></td>';
    addCategoryHtml += '<td id="eligibleCount_'+index+'" class="resetScholarshipList">-</td>';
    addCategoryHtml += '<td id="actualEligibleCount_'+index+'" class="resetScholarshipList">-</td>';
    addCategoryHtml += '<td id="cutOffMarks_'+index+'" class="resetScholarshipList">-</td>';
    addCategoryHtml += '<td id="studentPercentage_'+index+'" class="resetScholarshipList">-</td></tr>';
    $(document).find('#scholarshipListBody').append(addCategoryHtml);
}

function resetData() {
    $(document).find('.scholarshipCategoryCriteriaError').html('');
    $(document).find('.resetScholarshipList').html('-');
    $(document).find('.resetResultSnapshot').html('-');
    $(document).find("#vendorPerformanceBody").html('<tr><td colspan="3" style="text-align:center"><div class="noDataFoundDiv"><div class="innerHtml"><img src="/img/no-record.png" alt="no-record"><span>No data found with selected filters</span></div></div></td></tr>');
    var scholarshipBasis    = $('input[name="scholarshipBasis"]:checked').val();
    if(scholarshipBasis === 'percentage') {
        $("#scholarship_basis_th").html('Top Percentage');
        $(document).find('.selectMarksField').hide();
    } else if(scholarshipBasis === 'marks') {
        $("#scholarship_basis_th").html('Top Marks');
        $(document).find('.selectMarksField').show();
    }
}

function executeScholarshipLogic(){
    resetData();
    var validData = true;
    var cutOffField    = $("#cutOffField").val();    
    if ( typeof cutOffField==="undefined" || cutOffField==="" || cutOffField===null) {
        validData = false;
    }
    var cutOffMarks    = parseFloat($("#cutOffMarks").val());
    if (isNaN(cutOffMarks) || cutOffMarks<=0) {
        validData = false;
    }
    
    var scholarshipBasis    = $('input[name="scholarshipBasis"]:checked').val();
    var marksField = '';
    if(scholarshipBasis === 'percentage') {
        marksField = '';
    } else if(scholarshipBasis === 'marks') {
        marksField = $("#marksField").val();
        if(marksField === ''){
            validData = false;
        }
    }
    if ( typeof scholarshipBasis==="undefined" || scholarshipBasis==="" || scholarshipBasis===null) {
        validData = false;
    }
    
    var scholarshipCategories = [];
    $(".scholarshipCategoryCriteriaError").html('');
    $(".scholarshipCategoriesRow").each(function(){
        var categoryCriteria    = $(this).find("input.scholarshipCategoryCriteria").val();
        if (!$.isNumeric(categoryCriteria) || parseFloat(categoryCriteria)<=0) {
            $(this).find("div.scholarshipCategoryCriteriaError").html("Please enter a valid input.");
            validData = false;
        }
        if(scholarshipBasis === 'percentage' && parseFloat(categoryCriteria) > 100) {
            $(this).find("div.scholarshipCategoryCriteriaError").html("Please enter a valid input.");
            validData = false;
        }
        scholarshipCategories.push(parseFloat(categoryCriteria));
        if(scholarshipBasis === 'marks') {
            var thisObj = $(this);
            var temp = scholarshipCategories.slice();
            temp.pop();
            $.each(temp, function(index, value){
                if(parseFloat(categoryCriteria) >= value) {
                    $(thisObj).find("div.scholarshipCategoryCriteriaError").html("Please enter a valid input.");
                    validData = false;
                }
            });
        }
    });
    var dateFilterField    = '';
    var dateFilterVal    = '';
    var apperingFields    = '';
    if(typeof $("#dateFilterField").val()!=='undefined' || $("#dateFilterField").val()!=='' || $("#dateFilterField").val()!==NULL) {
        dateFilterField    = $("#dateFilterField").val();
    }
    if(typeof $("#dateFilterVal").val()!=='undefined' || $("#dateFilterVal").val()!=='' || $("#dateFilterVal").val()!==NULL) {
        dateFilterVal    = $("#dateFilterVal").val();
    }
    
    if(scholarshipCategories.length<1){
        validData = false;
    }
    apperingFields = $("#apperingFields").val();
    //var resultFieldsVal =apperingFields; //$("#resultFields").val();
//    var resultFields = [];
//    if(resultFieldsVal){
//        $.each(resultFieldsVal, function(index, value){
//            if(value !== '') {
//                resultFields.push(value);
//            }
//        });
//    }
//    if(resultFields.length<1){
//        validData = false;
//    }
    if(validData === true) {
        $.ajax({
            url: '/scores/scholarship-computation/'+jsVars.encryptId,
            type: 'post',
            dataType: 'json',
            data: {'cutOffField': cutOffField,'cutOffMarks':cutOffMarks, 'scholarshipBasis':scholarshipBasis,'scholarshipCategories':scholarshipCategories, 'dateFilterField':dateFilterField, 'dateFilterVal':dateFilterVal, 'apperingFields':apperingFields,'marksField':marksField},
            beforeSend: function () { 
                $('#scoreAutomationLoader .loader-block').show();
            },
            complete:function(){
                $('#scoreAutomationLoader .loader-block').show();
            },
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (response){
                if(response.status===1){
                    $.each( response['data']['scholarshipStats'], function( index, value ){
                        if(value['eligibleCount'] === '') {
                            $("#eligibleCount_"+index).html('-');
                        } else {
                            $("#eligibleCount_"+index).html(value['eligibleCount']);
                        }
                        if(value['actualEligibleCount'] === '') {
                            $("#actualEligibleCount_"+index).html('-');
                        } else {
                            $("#actualEligibleCount_"+index).html(value['actualEligibleCount']);
                        }
                        if(value['cutOffMarks'] === '') {
                            $("#cutOffMarks_"+index).html('-');
                        } else {
                            $("#cutOffMarks_"+index).html(value['cutOffMarks']);
                        }
                        if(value['studentPercentage'] === '') {
                            $("#studentPercentage_"+index).html('-');
                        } else {
                            $("#studentPercentage_"+index).html(value['studentPercentage']);
                        }
                    });
                    if(typeof response['data']['examResultData']['resultSnapshot'] !== 'undefined') {
                        $.each( response['data']['examResultData']['resultSnapshot'], function( index, value ){
                            if(value === '') {
                                $("#"+index).html('-');
                            } else {
                                $("#"+index).html(value);
                            }
                        });
                    }
                    if(typeof response['data']['examResultData']['vendorPerformance'] !== 'undefined') {
                        var naVendorData = '';
                        var allVendorData = '';
                        $.each( response['data']['examResultData']['vendorPerformance'], function( vendorName, vendorData ){
                            if(typeof vendorData['passed'] === 'undefined') {
                                vendorData['passed'] = '0';
                            }
                            if(vendorName === 'NA') {
                                naVendorData = '<tr><td>'+vendorName+'</td><td>'+vendorData['appeared']+'</td><td>'+vendorData['passed']+'</td></tr>';
                            } else {
                                allVendorData += '<tr><td>'+vendorName+'</td><td>'+vendorData['appeared']+'</td><td>'+vendorData['passed']+'</td></tr>';
                            }
                        });
                        allVendorData += naVendorData;
                        $("#vendorPerformanceBody").html(allVendorData);
                    }
                }else{
                    if (response.message === 'session'){
                        location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                    }else{
                        alertPopup(response.message);
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });   
    }
}

$('.daterangepicker_lpu').on('apply.daterangepicker', function (ev, picker) { 
    if(typeof(ev)!=''){
     $("#button_disable").prop('disabled',false);   
    }
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ',' + picker.endDate.format('DD/MM/YYYY'));
});

$('.daterangepicker_lpu').on('cancel.daterangepicker', function (ev, picker) {
    if(typeof(ev)!=''){
     $("#button_disable").prop('disabled',true);   
    }
    $(this).val('');
});
$('.daterangepicker_lpu').on('click', function (ev, picker) {
    if(typeof(ev)!=''){
     $("#button_disable").prop('disabled',true);   
    }
    $(this).val('');
});


$('.daterangepicker_lpu').daterangepicker({
    /*"startDate": "",
     "endDate": "",*/
    showDropdowns: true,
    showWeekNumbers: true,
    autoUpdateInput: false,
    locale: {
        format: 'DD/MM/YYYY',
        separator: ', ',
    },
    ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    opens: 'left'
});
function executeWorkFlowLogic(){
    resetData();
    var data = true;
    var college_id = $("#college-id").val();
    if(college_id === '5000'){
    var sel_field    = '';
    var sel_expression    = '';
    var sel_value    = '';
    sel_field    = $(".sel_field").val();
    if(typeof sel_field ==='undefined' || sel_field==='' || sel_field===null) {
        $('.sel_field').closest('div.errorCheck').find(".lead_error").html("Field cannot be blank !").show();
        data = false;
    }
    sel_expression    = $(".sel_expression").val();
    if(typeof sel_expression==='undefined' || sel_expression==='' || sel_expression===null) {
        $('.sel_expression').closest('div').find(".expression_error").html("Field cannot be blank !").show();
        data = false;
    }
    sel_value    = $(".sel_value").val();
    if(typeof sel_value==='undefined' || sel_value==='' || sel_value===null) {
        $('.sel_value').closest('div').append('<span class="error ifValueClass small">Field cannot be blank !</span>').show();
        data = false;
    }
    var postData = {'sel_field':sel_field, 'sel_expression':sel_expression,'sel_value':sel_value};
    }else if(college_id === '524'){
        var dateFilterField    = '';
        var dateFilterVal    = '';
        if(typeof $("#dateFilterField").val()!=='undefined' || $("#dateFilterField").val()!=='' || $("#dateFilterField").val()!==NULL) {
            dateFilterField    = $("#dateFilterField").val();
        }
        if(typeof $("#dateFilterVal").val()!=='undefined' || $("#dateFilterVal").val()!=='' || $("#dateFilterVal").val()!==NULL) {
            dateFilterVal    = $("#dateFilterVal").val();
        }
    var postData = {'dateFilterField':dateFilterField, 'dateFilterVal':dateFilterVal};
    }
    if(data === true){
        $.ajax({
            url: '/scores/executeWorkFlow/'+jsVars.encryptId,
            type: 'post',
            dataType: 'json',
            data: postData,
            headers: {
                "X-CSRF-Token": jsVars._csrfToken
            },
            success: function (response){
                if (typeof response['error'] !=="undefined") {
                if(response['error'] =='session_logout') {
                    location = jsVars.FULL_URL+jsVars.LOGOUT_PATH;
                } else {
                  $('#workflowError').html(response['error']);
                }
            }else{
                alertPopup(response['message'], 'success');
            }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        }); 
    }
}
