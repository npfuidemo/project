jQuery(function () {
    // Handler for .ready() called.
//    var json_form = jsVars.json_form;
//    console.log(json_form);
//    var json_elements = jsVars.json_elements;
//    console.log(json_elements);
});

var boxHeight = 0;
function go_down_form(attribute, formid)
{
//    alert(attribute);return false;
    add_npf_field(attribute);
    if (boxHeight > 350)
    {
        //window.location.href = "npf_form_fields.php?formId=" + formid + "#bottom";
    }
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = "none";
    document.getElementById('statusPanel').style.display = "none";
    document.getElementById('main_div').style.display = "block";
    if (jsVars.institute_first_visit === false) {
        document.getElementById('crayon').style.display = "block";
    }
}

function crayon_click(institueId, Id, csrfToken) {
    if (document.documentElement.scrollTop > 190 || self.pageYOffset > 190) {
        //alert("Bow Bow");
        document.getElementById(Id).style.display = 'none';
        window.location.href = "#topcrayon";
        var req1 = new XMLHttpRequest();
        req1.onreadystatechange = function ()
        {
            if (req1.readyState == 4) {
                if (req1.status == 200) { //alert(req1.responseText);return false;
                    var respose_text_val = req1.responseText;
                    //document.getElementById('change_page').innerHTML = respose_text_val;
                }
            }
        }

//        req1.open("GET", "form_first_view_update.php?pg=update", true);
//        req1.send("");
    } else
    {
        document.getElementById(Id).style.display = 'none';
        var req1 = new XMLHttpRequest();
        req1.onreadystatechange = function ()
        {
            if (req1.readyState == 4) {
                if (req1.status == 200) { //alert(req1.responseText);return false;
                    var respose_text_val = req1.responseText;
                    if (respose_text_val == 1)
                    {
                        return true;
                    }
                    //document.getElementById('change_page').innerHTML = respose_text_val;
                }
            }
        }
//        req1.open("GET", "form_first_view_update.php?pg=update", true);
//        req1.send("");
        //window.location.href = "npf_form_fields.php?formId="+formid+"#topcrayon";
    }
    
    // save flag in db for this college.
    $.ajax({
        url: '/form/guideStatusUpdate',
        type: "POST",
        headers: { 'X-CSRF-TOKEN' : csrfToken },
        cache: false,
        dataType: 'json',
        data: {institute_id: institueId},
        success: function (data) {
           if (data.status != true) {
               console.log('SomeThing Went wrong while updating guide status for college.')
           }
        }
    });
}

function form_save_exit() {
        var session_fomid = "<?php echo $_SESSION['formId']; ?>";
        save_form_attribute_data(session_fomid, 1);
        return false;
}