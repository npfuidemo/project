/* 
 * TA View Javascript functions.
 */
$(document).ready(function () {
    if ((typeof jsVars.disableCtlC !== 'undefined') && (jsVars.disableCtlC == 1)) {
        disableCtlC();
    }
});

function disableCtlC() {
    document.onkeydown = function(e) {
            if (e.ctrlKey && 
                (e.keyCode === 67 || //Ctrl + C
                 e.keyCode === 86 || //Ctrl + V
                 e.keyCode === 85 || //Ctrl + U
                 e.keyCode === 123 || //F12
                 e.keyCode === 73 || //i
                 e.keyCode === 76 || //I
                 e.keyCode === 117
                )) {
                //alert('not allowed');
                return false;
            } else {
                return true;
            }
    };
}


function resetTAViewForm() {
	//alert('asdfgn');
	$('form#testAdminViewForm input[type=text]').val('');
	 return true;
}