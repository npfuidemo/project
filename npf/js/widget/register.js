function validateEmail(i){var a=i.indexOf("@"),n=i.lastIndexOf(".");return!(a<1||n<a+2||n+2>=i.length)}function isNumber(i){var a=(i=i||window.event).which?i.which:i.keyCode;return!(a>31&&(a<48||a>57))}
//Refresh captcha on click
function getCaptchaCode(){var i=(new Date).getTime(),a="",n="",e="";
//alert(jsVars.uniqid);
void 0!==jsVars.college_id&&(a="&cid="+jsVars.college_id),void 0!==jsVars.uniqid&&("<uniqid>"==jsVars.uniqid&&(jsVars.uniqid=i+Math.floor(100*Math.random()),$("#uniqid").length>0&&$("#uniqid").val(jsVars.uniqid)),n="&u="+jsVars.uniqid),void 0!==jsVars.widgetId&&(e="&wid="+jsVars.widgetId),$("#CaptchaImage").attr("src",jsVars.CaptchaLink+"?"+i+a+n+e)}$(document).on("click","#CaptchaRefreshBtn",function(){getCaptchaCode()}),$(window).load(function(){getCaptchaCode()});